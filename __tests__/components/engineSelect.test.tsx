import { render, screen, fireEvent } from '@testing-library/react';
import EngineSelect from '@/components/engineCard/engineSelect';
import { CalculatorContext } from '@/modules/contexts';
import { ChangeEngineEvent } from '@/modules/customEvents';
import { Engine, EngineName, SelectedPart } from '@/@types/calculator';

// Mock the engines data
jest.mock('@/data/engines.json', () => ({
	'CHRG-eE1': {
		name: 'CHRG-eE1',
		imgUrl: '/engine1.jpg',
		specs: {
			power: '246',
			torque: '194',
			gearbox: 'Gearbox (CHRG-eE1)',
			configuration: 'Electric',
		},
		compatibleParts: [],
	},
	'eDen-1H': {
		name: 'eDen-1H',
		imgUrl: '/engine2.jpg',
		specs: {
			power: '320',
			torque: '250',
			gearbox: 'Gearbox (eDen-1H)',
			configuration: 'Electric',
		},
		compatibleParts: [],
	},
	'I4 DOHC': {
		name: 'I4 DOHC',
		imgUrl: '/engine3.jpg',
		specs: {
			power: '180',
			torque: '160',
			gearbox: 'Manual',
			configuration: 'I4',
		},
		compatibleParts: [],
	},
}));

// Mock the common module
jest.mock('@/modules/common', () => ({
	ENGINE_CONFIGURATIONS: ['Electric', 'I4', 'V6', 'V8'],
}));

// Mock the ChangeEngineEvent
jest.mock('@/modules/customEvents', () => ({
	ChangeEngineEvent: {
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

const defaultContextValue = {
	currentEngine: mockEngine as Engine | null,
	selectedParts: [] as SelectedPart[],
};

const renderWithContext = (contextValue = defaultContextValue) => {
	return render(
		<CalculatorContext.Provider value={contextValue}>
			<EngineSelect />
		</CalculatorContext.Provider>,
	);
};

describe('EngineSelect', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders configuration select with correct options', () => {
		renderWithContext();

		const configSelect = screen.getByLabelText('Configuration');
		expect(configSelect).toBeInTheDocument();

		// Check that configuration options are rendered
		expect(screen.getByText('Any')).toBeInTheDocument();
		expect(screen.getByText('Electric')).toBeInTheDocument();
		expect(screen.getByText('I4')).toBeInTheDocument();
		expect(screen.getByText('V6')).toBeInTheDocument();
		expect(screen.getByText('V8')).toBeInTheDocument();
	});

	it('renders engine select with correct current engine', () => {
		renderWithContext();

		const engineSelect = screen.getByLabelText('Engine');
		expect(engineSelect).toBeInTheDocument();
		expect(engineSelect).toHaveValue('CHRG-eE1');
	});

	it('renders engine select with empty value when no engine is selected', () => {
		renderWithContext({
			currentEngine: null,
			selectedParts: [],
		});

		const engineSelect = screen.getByLabelText('Engine');
		expect(engineSelect).toBeInTheDocument();
		expect(engineSelect).toHaveValue('-- None --');
	});

	it('displays "-- None --" option when no configuration is selected', () => {
		renderWithContext({
			currentEngine: null,
			selectedParts: [],
		});

		expect(screen.getByText('-- None --')).toBeInTheDocument();
	});

	it('filters engines by configuration when configuration is selected', () => {
		renderWithContext();

		const configSelect = screen.getByLabelText('Configuration');
		fireEvent.change(configSelect, { target: { value: 'Electric' } });

		// Should dispatch event with the first Electric engine
		expect(ChangeEngineEvent.dispatch).toHaveBeenCalledWith(
			expect.objectContaining({
				name: 'CHRG-eE1',
				specs: expect.objectContaining({
					configuration: 'Electric',
				}),
			}),
		);
	});

	it('handles engine selection change', () => {
		renderWithContext();

		const engineSelect = screen.getByLabelText('Engine');
		fireEvent.change(engineSelect, { target: { value: 'eDen-1H' } });

		expect(ChangeEngineEvent.dispatch).toHaveBeenCalledWith(
			expect.objectContaining({
				name: 'eDen-1H',
			}),
		);
	});

	it('dispatches null when empty configuration is selected', () => {
		renderWithContext();

		// First select a configuration
		const configSelect = screen.getByLabelText('Configuration');
		fireEvent.change(configSelect, { target: { value: 'Electric' } });

		// Then select "Any" (empty value)
		fireEvent.change(configSelect, { target: { value: '' } });

		// Should return early and not dispatch anything for empty value
		expect(ChangeEngineEvent.dispatch).toHaveBeenCalledTimes(1); // Only from the first call
	});

	it('applies custom className when provided', () => {
		const customClass = 'custom-test-class';
		render(
			<CalculatorContext.Provider value={defaultContextValue}>
				<EngineSelect className={customClass} />
			</CalculatorContext.Provider>,
		);

		const container = screen.getByText('Configuration').closest('div');
		expect(container).toHaveClass(customClass);
	});

	it('renders correct labels for selects', () => {
		renderWithContext();

		expect(screen.getByText('Configuration')).toBeInTheDocument();
		expect(screen.getByText('Engine')).toBeInTheDocument();
	});

	it('shows all engines when no configuration filter is applied', () => {
		renderWithContext({
			currentEngine: null,
			selectedParts: [],
		});

		// All engines should be available in the options
		expect(screen.getByText('CHRG-eE1')).toBeInTheDocument();
		expect(screen.getByText('eDen-1H')).toBeInTheDocument();
		expect(screen.getByText('I4 DOHC')).toBeInTheDocument();
	});

	it('handles configuration change that finds no matching engines gracefully', () => {
		renderWithContext();

		const configSelect = screen.getByLabelText('Configuration');
		fireEvent.change(configSelect, {
			target: { value: 'NonExistentConfig' },
		});

		// Should still update the state but not dispatch an engine
		// This tests the edge case where no engines match the configuration
		expect(ChangeEngineEvent.dispatch).not.toHaveBeenCalled();
	});

	it('maintains engine selection state correctly', () => {
		const { rerender } = renderWithContext();

		// Change to a different engine
		const engineSelect = screen.getByLabelText('Engine');
		fireEvent.change(engineSelect, { target: { value: 'eDen-1H' } });

		// Re-render with updated context
		rerender(
			<CalculatorContext.Provider
				value={{
					currentEngine: {
						...mockEngine,
						name: 'eDen-1H' as EngineName,
					},
					selectedParts: [],
				}}
			>
				<EngineSelect />
			</CalculatorContext.Provider>,
		);

		// Should show the new engine as selected
		const updatedEngineSelect = screen.getByLabelText('Engine');
		expect(updatedEngineSelect).toHaveValue('eDen-1H');
	});
});
