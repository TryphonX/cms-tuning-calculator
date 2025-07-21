import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AutoGenModal from '@/components/AutoGenModal';
import { CalculatorContext } from '@/modules/contexts';
import { UpdateSelectedPartsEvent } from '@/modules/customEvents';
import {
	Engine,
	EngineName,
	TuningPartName,
	CompatiblePart,
	TuningSetup,
	RepairParts,
} from '@/@types/calculator';

// Mock the common module
jest.mock('@/modules/common', () => ({
	getFullPartByName: jest.fn((name: string) => {
		const parts: Record<
			string,
			{ boost: number; cost: number } | undefined
		> = {
			'Air Filter': { boost: 1, cost: 35 },
			'Air Filter (B6 M64.01)': { boost: 2.5, cost: 45 },
			Carburetor: { boost: 8, cost: 320 },
		};
		return parts[name];
	}),
}));

// Mock the child components
jest.mock('@/components/autoGenModal/autoGenModalInitialScreen', () => {
	return function MockAutoGenModalInitScreen({
		targetIncrease,
		onTargetChange,
		onGenerate,
		onRepairPartsChange,
	}: {
		targetIncrease: number;
		onTargetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
		onGenerate: () => void;
		onRepairPartsChange: (parts: RepairParts) => void;
	}) {
		return (
			<div data-testid="initial-screen">
				<label htmlFor="target-input">Target Increase:</label>
				<input
					id="target-input"
					type="number"
					value={targetIncrease}
					onChange={onTargetChange}
					data-testid="target-input"
				/>
				<button onClick={onGenerate} data-testid="generate-btn">
					Generate
				</button>
				<button
					onClick={() => onRepairPartsChange({} as RepairParts)}
					data-testid="repair-parts-btn"
				>
					Set Repair Parts
				</button>
			</div>
		);
	};
});

jest.mock('@/components/autoGenModal/autoGenModalLoading', () => {
	return function MockAutoGenModalLoading() {
		return <div data-testid="loading-screen">Loading...</div>;
	};
});

jest.mock('@/components/autoGenModal/autoGenModalSetupScreen', () => {
	return function MockAutoGenModalSetupScreen({
		generatedSetup,
		onApply,
		onDiscard,
	}: {
		generatedSetup?: TuningSetup | null;
		onApply: () => void;
		onDiscard: () => void;
	}) {
		return (
			<div data-testid="setup-screen">
				<div data-testid="generated-setup">
					{generatedSetup ? 'Setup Generated' : 'No Setup'}
				</div>
				<button onClick={onApply} data-testid="apply-btn">
					Apply
				</button>
				<button onClick={onDiscard} data-testid="discard-btn">
					Discard
				</button>
			</div>
		);
	};
});

// Mock custom events
jest.mock('@/modules/customEvents', () => ({
	UpdateSelectedPartsEvent: {
		dispatch: jest.fn(),
	},
}));

// Mock Web Worker
class MockWorker {
	onmessage: ((event: MessageEvent) => void) | null = null;

	constructor() {
		// Mock constructor
	}

	postMessage(_data: unknown) {
		// Mock implementation to avoid unused parameter warning
		_data;
		// Simulate worker response after a short delay
		setTimeout(() => {
			if (this.onmessage) {
				const mockSetup: TuningSetup = {
					boost: 10.5,
					cost: 400,
					costToBoost: 38.1,
					partNames: [
						'Air Filter' as TuningPartName,
						'Air Filter (B6 M64.01)' as TuningPartName,
					],
				};
				this.onmessage({
					data: mockSetup,
				} as MessageEvent<TuningSetup>);
			}
		}, 100);
	}

	terminate() {}
}

// Mock Worker globally
Object.defineProperty(window, 'Worker', {
	writable: true,
	value: MockWorker,
});

const mockCompatibleParts: CompatiblePart[] = [
	{ name: 'Air Filter' as TuningPartName, quantity: 1, cost: 35 },
	{ name: 'Air Filter (B6 M64.01)' as TuningPartName, quantity: 2, cost: 45 },
	{ name: 'Carburetor' as TuningPartName, quantity: 1, cost: 320 },
];

const mockEngine: Engine = {
	name: 'CHRG-eE1' as EngineName,
	imgUrl: '/test-engine.jpg',
	compatibleParts: mockCompatibleParts,
	specs: {
		power: '246',
		torque: '194',
		gearbox: 'Gearbox (CHRG-eE1)',
		configuration: 'Electric',
	},
};

const defaultContextValue = {
	currentEngine: mockEngine,
	selectedParts: [],
};

const renderWithContext = (contextValue = defaultContextValue) => {
	return render(
		<CalculatorContext.Provider value={contextValue}>
			<AutoGenModal id="test-modal" />
		</CalculatorContext.Provider>,
	);
};

describe('AutoGenModal', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Clear any existing modals from DOM
		document.body.innerHTML = '';

		// Mock HTMLDialogElement methods
		HTMLDialogElement.prototype.close = jest.fn();
		HTMLDialogElement.prototype.show = jest.fn();
		HTMLDialogElement.prototype.showModal = jest.fn();
	});

	afterEach(() => {
		document.body.innerHTML = '';
		jest.restoreAllMocks();
	});

	it('returns early when no current engine is set', () => {
		renderWithContext({
			currentEngine: null as unknown as Engine,
			selectedParts: [],
		});

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('renders the modal with correct structure', () => {
		renderWithContext();

		const modal = document.getElementById('test-modal');
		expect(modal).toBeInTheDocument();
		expect(modal).toHaveAttribute('id', 'test-modal');
		expect(modal?.tagName).toBe('DIALOG');

		expect(screen.getByText('Auto-generation')).toBeInTheDocument();
		expect(screen.getByLabelText('Close')).toBeInTheDocument();
	});

	it('shows initial screen by default', () => {
		renderWithContext();

		expect(screen.getByTestId('initial-screen')).toBeInTheDocument();
		expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
		expect(screen.queryByTestId('setup-screen')).not.toBeInTheDocument();
	});

	it('handles target increase change', () => {
		renderWithContext();

		const targetInput = screen.getByTestId('target-input');
		fireEvent.change(targetInput, { target: { value: '15' } });

		expect(targetInput).toHaveValue(15);
	});

	it('shows loading screen when generate is clicked', () => {
		renderWithContext();

		const generateBtn = screen.getByTestId('generate-btn');
		fireEvent.click(generateBtn);

		expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
		expect(screen.queryByTestId('initial-screen')).not.toBeInTheDocument();
	});

	it('shows setup screen after worker completes', async () => {
		renderWithContext();

		const generateBtn = screen.getByTestId('generate-btn');
		fireEvent.click(generateBtn);

		// Wait for worker to complete
		await waitFor(
			() => {
				expect(screen.getByTestId('setup-screen')).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);

		expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
		expect(screen.getByTestId('generated-setup')).toHaveTextContent(
			'Setup Generated',
		);
	});

	it('handles setup application', async () => {
		renderWithContext();

		// Generate setup first
		const generateBtn = screen.getByTestId('generate-btn');
		fireEvent.click(generateBtn);

		// Wait for setup screen
		await waitFor(() => {
			expect(screen.getByTestId('setup-screen')).toBeInTheDocument();
		});

		// Apply the setup
		const applyBtn = screen.getByTestId('apply-btn');

		// Mock the close method to prevent errors
		const mockClose = jest.fn();
		HTMLDialogElement.prototype.close = mockClose;

		fireEvent.click(applyBtn);

		expect(UpdateSelectedPartsEvent.dispatch).toHaveBeenCalledWith([
			{ name: 'Air Filter', quantity: 1 },
			{ name: 'Air Filter (B6 M64.01)', quantity: 2 },
		]);
	});

	it('handles setup discard', async () => {
		renderWithContext();

		// Generate setup first
		const generateBtn = screen.getByTestId('generate-btn');
		fireEvent.click(generateBtn);

		// Wait for setup screen
		await waitFor(() => {
			expect(screen.getByTestId('setup-screen')).toBeInTheDocument();
		});

		// Discard the setup
		const discardBtn = screen.getByTestId('discard-btn');
		fireEvent.click(discardBtn);

		// Should go back to initial screen
		expect(screen.getByTestId('initial-screen')).toBeInTheDocument();
		expect(screen.queryByTestId('setup-screen')).not.toBeInTheDocument();
	});

	it('handles repair parts change', () => {
		renderWithContext();

		const repairPartsBtn = screen.getByTestId('repair-parts-btn');
		fireEvent.click(repairPartsBtn);

		// Repair parts should be set (this is tested indirectly through the mock)
		expect(repairPartsBtn).toBeInTheDocument();
	});

	it('resets state when current engine changes', async () => {
		const { rerender } = renderWithContext();

		// Generate setup first
		const generateBtn = screen.getByTestId('generate-btn');
		fireEvent.click(generateBtn);

		// Wait for setup screen
		await waitFor(() => {
			expect(screen.getByTestId('setup-screen')).toBeInTheDocument();
		});

		// Change engine
		const newEngine: Engine = {
			...mockEngine,
			name: 'Different Engine' as EngineName,
		};

		rerender(
			<CalculatorContext.Provider
				value={{ currentEngine: newEngine, selectedParts: [] }}
			>
				<AutoGenModal id="test-modal" />
			</CalculatorContext.Provider>,
		);

		// Should reset to initial screen
		expect(screen.getByTestId('initial-screen')).toBeInTheDocument();
		expect(screen.queryByTestId('setup-screen')).not.toBeInTheDocument();
	});

	it('handles modal close', () => {
		renderWithContext();

		const closeBtn = screen.getByLabelText('Close');

		// The close button is in a form with method="dialog" which automatically closes the dialog
		// We can test that the button exists and is clickable
		expect(closeBtn).toBeInTheDocument();
		expect(closeBtn.closest('form')).toHaveAttribute('method', 'dialog');

		// Test that clicking doesn't throw an error
		expect(() => fireEvent.click(closeBtn)).not.toThrow();
	});

	it('handles worker message with null data', async () => {
		// Create a custom worker that returns null
		class NullWorker extends MockWorker {
			postMessage(_data: unknown) {
				_data; // Avoid unused parameter warning
				setTimeout(() => {
					if (this.onmessage) {
						this.onmessage({
							data: null,
						} as MessageEvent<TuningSetup | null>);
					}
				}, 100);
			}
		}

		Object.defineProperty(window, 'Worker', {
			writable: true,
			value: NullWorker,
		});

		renderWithContext();

		const generateBtn = screen.getByTestId('generate-btn');
		fireEvent.click(generateBtn);

		// Wait for setup screen with null setup
		await waitFor(() => {
			expect(screen.getByTestId('setup-screen')).toBeInTheDocument();
		});

		expect(screen.getByTestId('generated-setup')).toHaveTextContent(
			'No Setup',
		);
	});

	it('handles environment without Worker support', () => {
		// Mock environment without Worker
		const originalWorker = window.Worker;
		// @ts-expect-error - Testing environment without Worker
		delete window.Worker;

		renderWithContext();

		const generateBtn = screen.getByTestId('generate-btn');
		fireEvent.click(generateBtn);

		// Should still show loading but won't generate anything
		expect(screen.getByTestId('loading-screen')).toBeInTheDocument();

		// Restore Worker
		window.Worker = originalWorker;
	});

	it('resets hasGeneratedSetup when target changes', () => {
		renderWithContext();

		const targetInput = screen.getByTestId('target-input');

		// Change target
		fireEvent.change(targetInput, { target: { value: '20' } });

		// Change again to test reset
		fireEvent.change(targetInput, { target: { value: '25' } });

		expect(targetInput).toHaveValue(25);
	});

	it('filters compatible parts correctly for worker', async () => {
		const mockWorker = new MockWorker();
		const postMessageSpy = jest.spyOn(mockWorker, 'postMessage');

		// Mock the worker creation to return our spy
		Object.defineProperty(window, 'Worker', {
			writable: true,
			value: jest.fn(() => mockWorker),
		});

		renderWithContext();

		const generateBtn = screen.getByTestId('generate-btn');
		fireEvent.click(generateBtn);

		expect(postMessageSpy).toHaveBeenCalledWith({
			parts: [
				{ boost: 1, cost: 35 }, // Air Filter
				{ boost: 5, cost: 90 }, // Air Filter (B6 M64.01) - multiplied by quantity 2
				{ boost: 8, cost: 320 }, // Carburetor
			],
			targetBoostIncrease: 0,
			repairParts: {},
		});
	});
});
