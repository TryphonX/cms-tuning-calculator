import { render, screen, fireEvent } from '@testing-library/react';
import RepairPartsTable from '@/components/AutoGenModal/RepairPartsTable';
import { CalculatorContext } from '@/modules/contexts';
import {
	Engine,
	EngineName,
	TuningPartName,
	CompatiblePart,
	RepairParts,
} from '@/@types/calculator';

// Mock the common module
jest.mock('@/modules/common', () => ({
	partSortFn: jest.fn(
		(sortBy: string) => (a: CompatiblePart, b: CompatiblePart) => {
			if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
			return 0;
		},
	),
}));

const mockCompatibleParts: CompatiblePart[] = [
	{ name: 'Air Filter' as TuningPartName, quantity: 2, cost: 35 },
	{ name: 'Carburetor' as TuningPartName, quantity: 1, cost: 320 },
	{ name: 'Turbocharger' as TuningPartName, quantity: 3, cost: 450 },
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
	locked: false,
	repairs: undefined,
};

const renderWithContext = (
	contextValue = defaultContextValue,
	repairParts: RepairParts = {} as RepairParts,
	onRepairPartsChange = jest.fn(),
) => {
	return render(
		<CalculatorContext.Provider value={contextValue}>
			<RepairPartsTable
				repairParts={repairParts}
				onRepairPartsChange={onRepairPartsChange}
			/>
		</CalculatorContext.Provider>,
	);
};

describe('RepairPartsTable', () => {
	const mockOnRepairPartsChange = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders table headers correctly', () => {
		renderWithContext(
			defaultContextValue,
			{} as RepairParts,
			mockOnRepairPartsChange,
		);

		expect(screen.getByText('Repair parts')).toBeInTheDocument();
		expect(screen.getByText('Part')).toBeInTheDocument();
		expect(screen.getByText('Quantity')).toBeInTheDocument();
	});

	it('renders compatible parts in table rows', () => {
		renderWithContext(
			defaultContextValue,
			{} as RepairParts,
			mockOnRepairPartsChange,
		);

		expect(screen.getByText('Air Filter')).toBeInTheDocument();
		expect(screen.getByText('Carburetor')).toBeInTheDocument();
		expect(screen.getByText('Turbocharger')).toBeInTheDocument();
	});

	it('renders range inputs for each part', () => {
		renderWithContext(
			defaultContextValue,
			{} as RepairParts,
			mockOnRepairPartsChange,
		);

		// Check that range inputs exist for each part
		const rangeInputs = screen.getAllByLabelText(
			'How many to be repaired of this part?',
		);
		expect(rangeInputs).toHaveLength(3);

		rangeInputs.forEach((input) => {
			expect(input).toBeInTheDocument();
			expect(input).toHaveAttribute('type', 'range');
		});
	});

	it('sets correct range input attributes', () => {
		renderWithContext(
			defaultContextValue,
			{} as RepairParts,
			mockOnRepairPartsChange,
		);

		const rangeInputs = screen.getAllByLabelText(
			'How many to be repaired of this part?',
		);

		// Air Filter should have max=2 (quantity)
		expect(rangeInputs[0]).toHaveAttribute('min', '0');
		expect(rangeInputs[0]).toHaveAttribute('max', '2');
		expect(rangeInputs[0]).toHaveAttribute('id', 'rangeInput-Air-Filter');

		// Carburetor should have max=1
		expect(rangeInputs[1]).toHaveAttribute('min', '0');
		expect(rangeInputs[1]).toHaveAttribute('max', '1');
		expect(rangeInputs[1]).toHaveAttribute('id', 'rangeInput-Carburetor');

		// Turbocharger should have max=3
		expect(rangeInputs[2]).toHaveAttribute('min', '0');
		expect(rangeInputs[2]).toHaveAttribute('max', '3');
		expect(rangeInputs[2]).toHaveAttribute('id', 'rangeInput-Turbocharger');
	});

	it('renders quantity markers for range inputs', () => {
		renderWithContext(
			defaultContextValue,
			{} as RepairParts,
			mockOnRepairPartsChange,
		);

		// Air Filter (quantity 2) should have markers 0, 1, 2
		expect(screen.getAllByText('0')).toHaveLength(3); // One for each part
		expect(screen.getAllByText('1')).toHaveLength(3); // One for each part
		expect(screen.getAllByText('2')).toHaveLength(2); // Air Filter and Turbocharger
		expect(screen.getAllByText('3')).toHaveLength(1); // Only Turbocharger
	});

	it('handles range input change and calls onRepairPartsChange', () => {
		renderWithContext(
			defaultContextValue,
			{} as RepairParts,
			mockOnRepairPartsChange,
		);

		const rangeInputs = screen.getAllByLabelText(
			'How many to be repaired of this part?',
		);
		const airFilterRange = rangeInputs[0];

		// Change value to 1
		fireEvent.change(airFilterRange, { target: { value: '1' } });

		expect(mockOnRepairPartsChange).toHaveBeenCalledWith({
			'Air Filter': -35, // quantity (1) * cost (35) * -1
		});
	});

	it('handles range input change to 0 and removes part from repair parts', () => {
		const initialRepairParts = {
			...({} as RepairParts),
			'Air Filter': -35,
		};

		renderWithContext(
			defaultContextValue,
			initialRepairParts,
			mockOnRepairPartsChange,
		);

		const rangeInputs = screen.getAllByLabelText(
			'How many to be repaired of this part?',
		);
		const airFilterRange = rangeInputs[0];

		// Change value to 0
		fireEvent.change(airFilterRange, { target: { value: '0' } });

		expect(mockOnRepairPartsChange).toHaveBeenCalledWith({});
	});

	it('calculates repair cost correctly for different quantities', () => {
		renderWithContext(
			defaultContextValue,
			{} as RepairParts,
			mockOnRepairPartsChange,
		);

		const rangeInputs = screen.getAllByLabelText(
			'How many to be repaired of this part?',
		);

		// Test Air Filter: quantity 2, cost 35 each = -70 total
		fireEvent.change(rangeInputs[0], { target: { value: '2' } });
		expect(mockOnRepairPartsChange).toHaveBeenCalledWith({
			'Air Filter': -70,
		});

		// Test Turbocharger: quantity 3, cost 450 each = -1350 total
		fireEvent.change(rangeInputs[2], { target: { value: '3' } });
		expect(mockOnRepairPartsChange).toHaveBeenCalledWith({
			Turbocharger: -1350,
		});
	});

	it('filters out missing parts from the table', () => {
		const engineWithMissingParts: Engine = {
			...mockEngine,
			compatibleParts: [
				...mockCompatibleParts,
				{
					name: 'Missing Part' as TuningPartName,
					quantity: 1,
					cost: 0,
					missing: true,
				},
			],
		};

		renderWithContext(
			{
				currentEngine: engineWithMissingParts,
				selectedParts: [],
				locked: false,
				repairs: undefined,
			},
			{} as RepairParts,
			mockOnRepairPartsChange,
		);

		// Should not show missing part
		expect(screen.queryByText('Missing Part')).not.toBeInTheDocument();

		// Should still show valid parts
		expect(screen.getByText('Air Filter')).toBeInTheDocument();
		expect(screen.getByText('Carburetor')).toBeInTheDocument();
		expect(screen.getByText('Turbocharger')).toBeInTheDocument();
	});

	it('handles engine change and resets repair parts', () => {
		const { rerender } = renderWithContext(
			defaultContextValue,
			{} as RepairParts,
			mockOnRepairPartsChange,
		);

		// Change to a different engine
		const newEngine: Engine = {
			...mockEngine,
			name: 'Different Engine' as EngineName,
		};

		rerender(
			<CalculatorContext.Provider
				value={{
					currentEngine: newEngine,
					selectedParts: [],
					locked: false,
					repairs: undefined,
				}}
			>
				<RepairPartsTable
					repairParts={{} as RepairParts}
					onRepairPartsChange={mockOnRepairPartsChange}
				/>
			</CalculatorContext.Provider>,
		);

		// Should call onRepairPartsChange with empty object
		expect(mockOnRepairPartsChange).toHaveBeenCalledWith({});
	});

	it('sorts parts by name in ascending order', () => {
		renderWithContext(
			defaultContextValue,
			{} as RepairParts,
			mockOnRepairPartsChange,
		);

		const partNames = screen.getAllByText(
			/^(Air Filter|Carburetor|Turbocharger)$/,
		);

		// Should be sorted alphabetically: Air Filter, Carburetor, Turbocharger
		expect(partNames[0]).toHaveTextContent('Air Filter');
		expect(partNames[1]).toHaveTextContent('Carburetor');
		expect(partNames[2]).toHaveTextContent('Turbocharger');
	});

	it('handles no current engine gracefully', () => {
		renderWithContext(
			{
				currentEngine: null as unknown as Engine,
				selectedParts: [],
				locked: false,
				repairs: undefined,
			},
			{} as RepairParts,
			mockOnRepairPartsChange,
		);

		// Should still render headers
		expect(screen.getByText('Repair parts')).toBeInTheDocument();
		expect(screen.getByText('Part')).toBeInTheDocument();
		expect(screen.getByText('Quantity')).toBeInTheDocument();

		// Should not render any parts
		expect(screen.queryByText('Air Filter')).not.toBeInTheDocument();
		expect(screen.queryByText('Carburetor')).not.toBeInTheDocument();
		expect(screen.queryByText('Turbocharger')).not.toBeInTheDocument();
	});

	it('handles parts with spaces in names correctly in ID generation', () => {
		const engineWithSpacedNames: Engine = {
			...mockEngine,
			compatibleParts: [
				{
					name: 'Air Filter (Special Edition)' as TuningPartName,
					quantity: 1,
					cost: 50,
				},
			],
		};

		renderWithContext(
			{
				currentEngine: engineWithSpacedNames,
				selectedParts: [],
				locked: false,
				repairs: undefined,
			},
			{} as RepairParts,
			mockOnRepairPartsChange,
		);

		// Should replace spaces with hyphens in ID
		const rangeInput = document.getElementById(
			'rangeInput-Air-Filter-(Special-Edition)',
		);
		expect(rangeInput).toBeInTheDocument();
		expect(rangeInput).toHaveAttribute(
			'id',
			'rangeInput-Air-Filter-(Special-Edition)',
		);
	});

	it('updates repair parts with multiple selections', () => {
		renderWithContext(
			defaultContextValue,
			{} as RepairParts,
			mockOnRepairPartsChange,
		);

		const rangeInputs = screen.getAllByLabelText(
			'How many to be repaired of this part?',
		);

		// Select 1 Air Filter
		fireEvent.change(rangeInputs[0], { target: { value: '1' } });
		expect(mockOnRepairPartsChange).toHaveBeenCalledWith({
			'Air Filter': -35,
		});

		// Mock the updated repair parts and select 1 Carburetor
		mockOnRepairPartsChange.mockClear();
		fireEvent.change(rangeInputs[1], { target: { value: '1' } });
		expect(mockOnRepairPartsChange).toHaveBeenCalledWith({
			Carburetor: -320,
		});
	});

	it('renders with existing repair parts values', () => {
		const existingRepairParts = {
			...({} as RepairParts),
			'Air Filter': -70,
			Carburetor: -320,
		};

		renderWithContext(
			defaultContextValue,
			existingRepairParts,
			mockOnRepairPartsChange,
		);

		// Inputs should still be functional even with existing values
		const rangeInputs = screen.getAllByLabelText(
			'How many to be repaired of this part?',
		);
		expect(rangeInputs[0]).toBeInTheDocument();
		expect(rangeInputs[1]).toBeInTheDocument();
	});

	it('handles tooltip data attribute correctly', () => {
		renderWithContext(
			defaultContextValue,
			{} as RepairParts,
			mockOnRepairPartsChange,
		);

		const tooltipDivs = screen
			.getAllByRole('slider')
			.map((input) => input.closest('div'));

		// Should have tooltip divs with correct classes
		tooltipDivs.forEach((div) => {
			if (div) {
				expect(div).toHaveClass(
					'max-sm:tooltip',
					'max-sm:tooltip-primary',
					'w-full',
				);
			}
		});
	});
});
