import { render, screen, fireEvent } from '@testing-library/react';
import CompatiblePartsCard from '@/components/CompatiblePartsCard';
import { CalculatorContext } from '@/modules/contexts';
import { UpdateSelectedPartsEvent } from '@/modules/customEvents';
import {
	Engine,
	SelectedPart,
	EngineName,
	TuningPartName,
} from '@/@types/calculator';
import { Action } from '@/@types/globals';

// Mock the Card component
jest.mock('@/components/card/card', () => {
	return function MockCard({
		title,
		className,
		actions,
		footerActions,
		children,
	}: {
		title: string;
		className?: string;
		actions?: Action[];
		footerActions?: Action[];
		children: React.ReactNode;
	}) {
		return (
			<div data-testid="card" className={className}>
				<h2>{title}</h2>
				<div data-testid="actions">
					{actions?.map((action: Action, index: number) => (
						<button
							key={index}
							onClick={action.onClick}
							disabled={action.disabled}
							className={action.className}
							data-testid={`action-${index}`}
						>
							{action.optionalLabel || action.label}
						</button>
					))}
				</div>
				{children}
				<div data-testid="footer-actions">
					{footerActions?.map((action: Action, index: number) => (
						<button
							key={index}
							onClick={action.onClick}
							disabled={action.disabled}
							className={action.className}
							data-testid={`footer-action-${index}`}
						>
							{action.label}
						</button>
					))}
				</div>
			</div>
		);
	};
});

// Mock the CompatiblePartsTable component
jest.mock('@/components/compatiblePartsCard/compatiblePartsTable', () => {
	return function MockCompatiblePartsTable() {
		return (
			<div data-testid="compatible-parts-table">
				Compatible Parts Table
			</div>
		);
	};
});

// Mock the AutoGenModal component
jest.mock('@/components/autoGenModal/autoGenModal', () => {
	return function MockAutoGenModal({ id }: { id: string }) {
		return (
			<div data-testid="auto-gen-modal" id={id}>
				Auto Gen Modal
			</div>
		);
	};
});

// Mock the UpdateSelectedPartsEvent
jest.mock('@/modules/customEvents', () => ({
	UpdateSelectedPartsEvent: {
		dispatch: jest.fn(),
	},
}));

const mockEngine: Engine = {
	name: 'CHRG-eE1' as EngineName,
	imgUrl: '/test-engine.jpg',
	compatibleParts: [],
	specs: {
		power: '246',
		torque: '194',
		gearbox: 'Gearbox (CHRG-eE1)',
		configuration: 'Electric',
	},
};

const mockSelectedParts: SelectedPart[] = [
	{ name: 'Air Filter' as TuningPartName, quantity: 1 },
	{ name: 'Carburetor' as TuningPartName, quantity: 2 },
];

const defaultContextValue = {
	currentEngine: mockEngine,
	selectedParts: mockSelectedParts,
	locked: false,
	repairs: undefined,
};

const renderWithContext = (contextValue = defaultContextValue) => {
	return render(
		<CalculatorContext.Provider value={contextValue}>
			<CompatiblePartsCard />
		</CalculatorContext.Provider>,
	);
};

describe('CompatiblePartsCard', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Mock the showModal method
		Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
			writable: true,
			value: jest.fn(),
		});
	});

	it('renders the card with correct title', () => {
		renderWithContext();

		expect(screen.getByText('Available Parts')).toBeInTheDocument();
	});

	it('renders the CompatiblePartsTable component', () => {
		renderWithContext();

		expect(
			screen.getByTestId('compatible-parts-table'),
		).toBeInTheDocument();
	});

	it('renders the AutoGenModal component with correct id', () => {
		renderWithContext();

		const modal = screen.getByTestId('auto-gen-modal');
		expect(modal).toBeInTheDocument();
		expect(modal).toHaveAttribute('id', 'autoGenModal');
	});

	it('renders auto-generate action button when engine is selected', () => {
		renderWithContext();

		const autoGenButton = screen.getByTestId('action-0');
		expect(autoGenButton).toBeInTheDocument();
		expect(autoGenButton).toHaveTextContent('Auto-generate');
		expect(autoGenButton).not.toBeDisabled();
	});

	it('disables auto-generate action when no engine is selected', () => {
		renderWithContext({
			currentEngine: null as unknown as Engine,
			selectedParts: [],
			locked: false,
			repairs: undefined,
		});

		const autoGenButton = screen.getByTestId('action-0');
		expect(autoGenButton).toBeDisabled();
	});

	it('opens modal when auto-generate button is clicked', () => {
		// Mock getElementById to return a mock dialog element
		const mockModal = {
			showModal: jest.fn(),
		} as unknown as HTMLDialogElement;

		jest.spyOn(document, 'getElementById').mockReturnValue(mockModal);

		renderWithContext();

		const autoGenButton = screen.getByTestId('action-0');
		fireEvent.click(autoGenButton);

		expect(document.getElementById).toHaveBeenCalledWith('autoGenModal');
		expect(mockModal.showModal).toHaveBeenCalled();
	});

	it('handles case when modal element is not found', () => {
		jest.spyOn(document, 'getElementById').mockReturnValue(null);

		renderWithContext();

		const autoGenButton = screen.getByTestId('action-0');

		// Should not throw when modal is not found
		expect(() => fireEvent.click(autoGenButton)).not.toThrow();
	});

	it('renders clear action button when parts are selected', () => {
		renderWithContext();

		const clearButton = screen.getByTestId('footer-action-0');
		expect(clearButton).toBeInTheDocument();
		expect(clearButton).toHaveTextContent('Clear');
		expect(clearButton).not.toBeDisabled();
	});

	it('disables clear action when no parts are selected', () => {
		renderWithContext({
			currentEngine: mockEngine,
			selectedParts: [],
			locked: false,
			repairs: undefined,
		});

		const clearButton = screen.getByTestId('footer-action-0');
		expect(clearButton).toBeDisabled();
	});

	it('dispatches UpdateSelectedPartsEvent with empty array when clear is clicked', () => {
		renderWithContext();

		const clearButton = screen.getByTestId('footer-action-0');
		fireEvent.click(clearButton);

		expect(UpdateSelectedPartsEvent.dispatch).toHaveBeenCalledWith([]);
	});

	it('applies custom className when provided', () => {
		const customClass = 'custom-test-class';
		render(
			<CalculatorContext.Provider value={defaultContextValue}>
				<CompatiblePartsCard className={customClass} />
			</CalculatorContext.Provider>,
		);

		const card = screen.getByTestId('card');
		expect(card).toHaveClass(customClass);
	});

	it('memoizes actions correctly based on engine state', () => {
		const { rerender } = renderWithContext();

		const autoGenButton1 = screen.getByTestId('action-0');
		expect(autoGenButton1).not.toBeDisabled();

		// Re-render with no engine
		rerender(
			<CalculatorContext.Provider
				value={{
					currentEngine: null as unknown as Engine,
					selectedParts: mockSelectedParts,
					locked: false,
					repairs: undefined,
				}}
			>
				<CompatiblePartsCard />
			</CalculatorContext.Provider>,
		);

		const autoGenButton2 = screen.getByTestId('action-0');
		expect(autoGenButton2).toBeDisabled();
	});

	it('memoizes footer actions correctly based on selected parts', () => {
		const { rerender } = renderWithContext();

		const clearButton1 = screen.getByTestId('footer-action-0');
		expect(clearButton1).not.toBeDisabled();

		// Re-render with no selected parts
		rerender(
			<CalculatorContext.Provider
				value={{
					currentEngine: mockEngine,
					selectedParts: [],
					locked: false,
					repairs: undefined,
				}}
			>
				<CompatiblePartsCard />
			</CalculatorContext.Provider>,
		);

		const clearButton2 = screen.getByTestId('footer-action-0');
		expect(clearButton2).toBeDisabled();
	});

	it('renders without errors when no props are provided', () => {
		expect(() => renderWithContext()).not.toThrow();
	});
});
