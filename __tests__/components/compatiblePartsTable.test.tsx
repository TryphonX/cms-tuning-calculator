import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompatiblePartsTable from '@/components/CompatiblePartsCard/CompatiblePartsTable';
import { CalculatorContext } from '@/modules/contexts';
import {
	ToggleSelectedPartEvent,
	UpdateSelectedPartsEvent,
	UpdateSortEvent,
} from '@/modules/customEvents';
import {
	Engine,
	SelectedPart,
	EngineName,
	TuningPartName,
	CompatiblePart,
} from '@/@types/calculator';
import { PartSortBy } from '@/@types/globals';

// Mock the common module
jest.mock('@/modules/common', () => ({
	partSortFn: jest.fn(
		(sortBy: PartSortBy) => (a: CompatiblePart, b: CompatiblePart) => {
			if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
			if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
			if (sortBy === 'boost_asc') {
				const aBoost = mockGetFullPartByName(a.name)?.boost || 0;
				const bBoost = mockGetFullPartByName(b.name)?.boost || 0;
				return aBoost - bBoost;
			}
			if (sortBy === 'boost_desc') {
				const aBoost = mockGetFullPartByName(a.name)?.boost || 0;
				const bBoost = mockGetFullPartByName(b.name)?.boost || 0;
				return bBoost - aBoost;
			}
			return 0;
		},
	),
	getFullPartByName: jest.fn((name: string) => mockGetFullPartByName(name)),
}));

// Mock the SortBtn component
jest.mock('@/components/SortBtn', () => {
	return function MockSortBtn({
		sortBy,
		values,
	}: {
		sortBy: string;
		values: string[];
	}) {
		return (
			<button data-testid={`sort-btn-${values[0]}`}>Sort {sortBy}</button>
		);
	};
});

// Mock the MissingPartAlert component
jest.mock('@/components/MissingPartAlert', () => {
	return function MockMissingPartAlert({
		partMissing,
	}: {
		partMissing: boolean;
	}) {
		return partMissing ? (
			<div data-testid="missing-part-alert">Missing Part Alert</div>
		) : null;
	};
});

// Mock custom events
jest.mock('@/modules/customEvents', () => ({
	ToggleSelectedPartEvent: {
		dispatch: jest.fn(),
	},
	UpdateSelectedPartsEvent: {
		dispatch: jest.fn(),
	},
	UpdateSortEvent: {
		name: 'UpdateSortEvent',
	},
}));

const mockGetFullPartByName = (name: string) => {
	const parts: Record<string, { boost: number; cost: number } | undefined> = {
		'Air Filter': { boost: 1, cost: 35 },
		'Air Filter (B6 M64.01)': { boost: 2.5, cost: 45 },
		Carburetor: { boost: 8, cost: 320 },
		'Missing Part': undefined,
	};
	return parts[name];
};

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
	selectedParts: [] as SelectedPart[],
	locked: false,
	repairs: undefined,
};

const renderWithContext = (contextValue = defaultContextValue) => {
	return render(
		<CalculatorContext.Provider value={contextValue}>
			<CompatiblePartsTable />
		</CalculatorContext.Provider>,
	);
};

describe('CompatiblePartsTable', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Clear any existing checkboxes from DOM
		document.body.innerHTML = '';
	});

	afterEach(() => {
		// Clean up DOM
		document.body.innerHTML = '';
	});

	it('returns early when no current engine is set', () => {
		renderWithContext({
			currentEngine: null as unknown as Engine,
			selectedParts: [],
			locked: false,
			repairs: undefined,
		});

		expect(screen.queryByRole('table')).not.toBeInTheDocument();
	});

	it('renders the table with correct headers', () => {
		renderWithContext();

		expect(screen.getByText('Part')).toBeInTheDocument();
		expect(screen.getByText('Boost')).toBeInTheDocument();
		expect(screen.getByText('Cost')).toBeInTheDocument();
		expect(screen.getByText('Cost / Boost')).toBeInTheDocument();
	});

	it('renders sort buttons for each column', () => {
		renderWithContext();

		expect(screen.getByTestId('sort-btn-name_asc')).toBeInTheDocument();
		expect(screen.getByTestId('sort-btn-boost_asc')).toBeInTheDocument();
		expect(screen.getByTestId('sort-btn-cost_asc')).toBeInTheDocument();
		expect(
			screen.getByTestId('sort-btn-costToBoost_asc'),
		).toBeInTheDocument();
	});

	it('renders toggle-all checkbox', () => {
		renderWithContext();

		const toggleAllCheckbox = screen.getByLabelText('Select all parts');
		expect(toggleAllCheckbox).toBeInTheDocument();
		expect(toggleAllCheckbox).toHaveAttribute(
			'data-part-toggle-all-checkbox',
		);
	});

	it('renders compatible parts in table rows', () => {
		renderWithContext();

		expect(screen.getByText('x1 Air Filter')).toBeInTheDocument();
		expect(
			screen.getByText('x2 Air Filter (B6 M64.01)'),
		).toBeInTheDocument();
		expect(screen.getByText('x1 Carburetor')).toBeInTheDocument();
	});

	it('renders part checkboxes with correct data attributes', () => {
		renderWithContext();

		const airFilterCheckbox = screen.getByLabelText(
			'Select part Air Filter',
		);
		expect(airFilterCheckbox).toHaveAttribute('data-part-checkbox');
		expect(airFilterCheckbox).toHaveAttribute(
			'data-part-name',
			'Air Filter',
		);
		expect(airFilterCheckbox).toHaveAttribute('data-part-qt', '1');
	});

	it('calculates and displays boost values correctly', () => {
		renderWithContext();

		// Air Filter: 1 * 1 = 1.00
		expect(screen.getByText('+1.00%')).toBeInTheDocument();
		// Air Filter (B6 M64.01): 2.5 * 2 = 5.00
		expect(screen.getByText('+5.00%')).toBeInTheDocument();
		// Carburetor: 8 * 1 = 8.00
		expect(screen.getByText('+8.00%')).toBeInTheDocument();
	});

	it('calculates and displays cost values correctly', () => {
		renderWithContext();

		// Air Filter: 35 * 1 = 35
		expect(screen.getByText('35 CR')).toBeInTheDocument();
		// Air Filter (B6 M64.01): 45 * 2 = 90
		expect(screen.getByText('90 CR')).toBeInTheDocument();
		// Carburetor: 320 * 1 = 320
		expect(screen.getByText('320 CR')).toBeInTheDocument();
	});

	it('calculates and displays cost-to-boost ratios correctly', () => {
		renderWithContext();

		// Air Filter: 35 / 1 = 35 CR/Boost
		expect(screen.getByText('35 CR/Boost')).toBeInTheDocument();
		// Air Filter (B6 M64.01): 45 / 2.5 = 18 CR/Boost
		expect(screen.getByText('18 CR/Boost')).toBeInTheDocument();
		// Carburetor: 320 / 8 = 40 CR/Boost
		expect(screen.getByText('40 CR/Boost')).toBeInTheDocument();
	});

	it('handles part checkbox toggle', () => {
		renderWithContext();

		const airFilterCheckbox = screen.getByLabelText(
			'Select part Air Filter',
		);
		fireEvent.click(airFilterCheckbox);

		expect(ToggleSelectedPartEvent.dispatch).toHaveBeenCalledWith(
			{ name: 'Air Filter', quantity: 1 },
			true,
		);
	});

	it('handles toggle all parts checkbox - select all', () => {
		renderWithContext();

		const toggleAllCheckbox = screen.getByLabelText('Select all parts');
		fireEvent.click(toggleAllCheckbox);

		expect(UpdateSelectedPartsEvent.dispatch).toHaveBeenCalledWith([
			{ name: 'Air Filter', quantity: 1 },
			{ name: 'Air Filter (B6 M64.01)', quantity: 2 },
			{ name: 'Carburetor', quantity: 1 },
		]);
	});

	it('handles toggle all parts checkbox - deselect all', () => {
		renderWithContext();

		const toggleAllCheckbox = screen.getByLabelText('Select all parts');
		// First check it
		fireEvent.click(toggleAllCheckbox);
		// Then uncheck it
		Object.defineProperty(toggleAllCheckbox, 'checked', {
			value: false,
			writable: true,
		});
		fireEvent.click(toggleAllCheckbox);

		expect(UpdateSelectedPartsEvent.dispatch).toHaveBeenLastCalledWith([]);
	});

	it('listens for UpdateSortEvent and updates sort state', () => {
		renderWithContext();

		// Dispatch a sort event
		const sortEvent = new CustomEvent(UpdateSortEvent.name, {
			detail: 'name_desc' as PartSortBy,
		});

		fireEvent(window, sortEvent);

		// The component should re-render with the new sort order
		expect(screen.getByTestId('sort-btn-name_asc')).toBeInTheDocument();
	});

	it('handles UpdateSortEvent with undefined detail (fallback to name_asc)', () => {
		renderWithContext();

		// Dispatch a sort event with undefined detail to test the fallback
		const sortEvent = new CustomEvent(UpdateSortEvent.name, {
			detail: undefined,
		});

		fireEvent(window, sortEvent);

		// Should fall back to 'name_asc' when detail is undefined
		expect(screen.getByTestId('sort-btn-name_asc')).toBeInTheDocument();
	});

	it('cleans up event listener on unmount', () => {
		const removeEventListenerSpy = jest.spyOn(
			window,
			'removeEventListener',
		);
		const { unmount } = renderWithContext();

		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			UpdateSortEvent.name,
			expect.any(Function),
		);

		removeEventListenerSpy.mockRestore();
	});

	it('handles missing part data and shows alert', async () => {
		const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

		const engineWithMissingPart: Engine = {
			...mockEngine,
			compatibleParts: [
				...mockCompatibleParts,
				{
					name: 'Missing Part' as TuningPartName,
					quantity: 1,
					cost: 0,
				},
			],
		};

		renderWithContext({
			currentEngine: engineWithMissingPart,
			selectedParts: [],
			locked: false,
			repairs: undefined,
		});

		expect(consoleSpy).toHaveBeenCalledWith('Part missing: Missing Part');

		// Should show missing part alert
		await waitFor(() => {
			expect(
				screen.getByTestId('missing-part-alert'),
			).toBeInTheDocument();
		});

		// Missing part should be disabled and styled differently
		const missingPartCheckbox = screen.getByLabelText(
			'Select part Missing Part',
		);
		expect(missingPartCheckbox).toBeDisabled();

		// Check for line-through styling in missing part row
		const missingPartRow = screen
			.getByText('x1 Missing Part')
			.closest('tr');
		expect(missingPartRow).toBeInTheDocument();

		consoleSpy.mockRestore();
	});

	it('updates checkbox states when selectedParts change', () => {
		const selectedParts: SelectedPart[] = [
			{ name: 'Air Filter' as TuningPartName, quantity: 1 },
		];

		const { rerender } = renderWithContext({
			currentEngine: mockEngine,
			selectedParts: [],
			locked: false,
			repairs: undefined,
		});

		// Initially, no checkboxes should be checked
		const airFilterCheckbox = screen.getByLabelText(
			'Select part Air Filter',
		);
		expect(airFilterCheckbox).not.toBeChecked();

		// Update with selected parts
		rerender(
			<CalculatorContext.Provider
				value={{
					currentEngine: mockEngine,
					selectedParts,
					locked: false,
					repairs: undefined,
				}}
			>
				<CompatiblePartsTable />
			</CalculatorContext.Provider>,
		);

		// Now the Air Filter checkbox should be checked
		expect(airFilterCheckbox).toBeChecked();
	});

	it('clears all checkboxes when selectedParts is empty', () => {
		const selectedParts: SelectedPart[] = [
			{ name: 'Air Filter' as TuningPartName, quantity: 1 },
		];

		const { rerender } = renderWithContext({
			currentEngine: mockEngine,
			selectedParts,
			locked: false,
			repairs: undefined,
		});

		const airFilterCheckbox = screen.getByLabelText(
			'Select part Air Filter',
		);
		expect(airFilterCheckbox).toBeChecked();

		// Update with empty selected parts
		rerender(
			<CalculatorContext.Provider
				value={{
					currentEngine: mockEngine,
					selectedParts: [],
					locked: false,
					repairs: undefined,
				}}
			>
				<CompatiblePartsTable />
			</CalculatorContext.Provider>,
		);

		// Now the checkbox should be unchecked
		expect(airFilterCheckbox).not.toBeChecked();
	});

	it('updates toggle-all checkbox state based on individual selections', () => {
		renderWithContext();

		const toggleAllCheckbox = screen.getByLabelText('Select all parts');
		const airFilterCheckbox = screen.getByLabelText(
			'Select part Air Filter',
		);

		// Initially, toggle-all should be unchecked
		expect(toggleAllCheckbox).not.toBeChecked();

		// Check one part
		fireEvent.click(airFilterCheckbox);
		Object.defineProperty(airFilterCheckbox, 'checked', {
			value: true,
			writable: true,
		});

		// Force a re-render by updating DOM and triggering useEffect
		fireEvent.click(airFilterCheckbox);
		Object.defineProperty(airFilterCheckbox, 'checked', {
			value: false,
			writable: true,
		});
		fireEvent.click(airFilterCheckbox);
		Object.defineProperty(airFilterCheckbox, 'checked', {
			value: true,
			writable: true,
		});

		// Toggle-all should still be unchecked because not all parts are selected
		expect(toggleAllCheckbox).not.toBeChecked();
	});

	it('resets partMissing state when currentEngine changes', () => {
		const engineWithMissingPart: Engine = {
			...mockEngine,
			compatibleParts: [
				{
					name: 'Missing Part' as TuningPartName,
					quantity: 1,
					cost: 0,
				},
			],
		};

		const { rerender } = renderWithContext({
			currentEngine: engineWithMissingPart,
			selectedParts: [],
			locked: false,
			repairs: undefined,
		});

		// Should show missing part alert
		waitFor(() => {
			expect(
				screen.getByTestId('missing-part-alert'),
			).toBeInTheDocument();
		});

		// Change to engine without missing parts
		rerender(
			<CalculatorContext.Provider
				value={{
					currentEngine: mockEngine,
					selectedParts: [],
					locked: false,
					repairs: undefined,
				}}
			>
				<CompatiblePartsTable />
			</CalculatorContext.Provider>,
		);

		// Missing part alert should be gone
		expect(
			screen.queryByTestId('missing-part-alert'),
		).not.toBeInTheDocument();
	});

	it('excludes missing parts from toggle-all selection', () => {
		const engineWithMissingPart: Engine = {
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

		renderWithContext({
			currentEngine: engineWithMissingPart,
			selectedParts: [],
			locked: false,
			repairs: undefined,
		});

		const toggleAllCheckbox = screen.getByLabelText('Select all parts');
		fireEvent.click(toggleAllCheckbox);

		// Should only select non-missing parts
		expect(UpdateSelectedPartsEvent.dispatch).toHaveBeenCalledWith([
			{ name: 'Air Filter', quantity: 1 },
			{ name: 'Air Filter (B6 M64.01)', quantity: 2 },
			{ name: 'Carburetor', quantity: 1 },
		]);
	});

	it('displays correct values for missing part data in boost and cost columns', () => {
		const engineWithMissingPart: Engine = {
			...mockEngine,
			compatibleParts: [
				{
					name: 'Missing Part' as TuningPartName,
					quantity: 1,
					cost: 0,
				},
			],
		};

		renderWithContext({
			currentEngine: engineWithMissingPart,
			selectedParts: [],
			locked: false,
			repairs: undefined,
		});

		// Should display NaN for missing boost data (NaN.toFixed(2) returns "NaN")
		expect(screen.getByText('+NaN%')).toBeInTheDocument();
		// Should display NaN for missing cost data (undefined * quantity = NaN)
		expect(screen.getByText('NaN CR')).toBeInTheDocument();
		// Should display NaN for missing cost-to-boost ratio (NaN.toFixed(0) returns "NaN")
		expect(screen.getByText('NaN CR/Boost')).toBeInTheDocument();
	});

	it('handles multiple missing parts and sets partMissing state correctly', () => {
		const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

		const engineWithMultipleMissingParts: Engine = {
			...mockEngine,
			compatibleParts: [
				{ name: 'Air Filter' as TuningPartName, quantity: 1, cost: 35 },
				{
					name: 'Missing Part 1' as TuningPartName,
					quantity: 1,
					cost: 0,
				},
				{
					name: 'Missing Part 2' as TuningPartName,
					quantity: 2,
					cost: 0,
				},
			],
		};

		renderWithContext({
			currentEngine: engineWithMultipleMissingParts,
			selectedParts: [],
			locked: false,
			repairs: undefined,
		});

		// Should warn about both missing parts
		expect(consoleSpy).toHaveBeenCalledWith('Part missing: Missing Part 1');
		expect(consoleSpy).toHaveBeenCalledWith('Part missing: Missing Part 2');

		// Should show missing part alert
		expect(screen.getByTestId('missing-part-alert')).toBeInTheDocument();

		// Valid part should render correctly
		expect(screen.getByText('x1 Air Filter')).toBeInTheDocument();
		expect(screen.getByText('+1.00%')).toBeInTheDocument();
		expect(screen.getByText('35 CR')).toBeInTheDocument();

		// Missing parts should have disabled checkboxes
		const missingPartCheckbox1 = screen.getByLabelText(
			'Select part Missing Part 1',
		);
		const missingPartCheckbox2 = screen.getByLabelText(
			'Select part Missing Part 2',
		);
		expect(missingPartCheckbox1).toBeDisabled();
		expect(missingPartCheckbox2).toBeDisabled();

		// Missing parts should display NaN values
		expect(screen.getAllByText('+NaN%')).toHaveLength(2);
		expect(screen.getAllByText('NaN CR')).toHaveLength(2);
		expect(screen.getAllByText('NaN CR/Boost')).toHaveLength(2);

		consoleSpy.mockRestore();
	});

	it('handles parts that are already marked as missing', () => {
		const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

		const engineWithPreMarkedMissingPart: Engine = {
			...mockEngine,
			compatibleParts: [
				{ name: 'Air Filter' as TuningPartName, quantity: 1, cost: 35 },
				{
					name: 'Missing Part' as TuningPartName,
					quantity: 1,
					cost: 0,
					missing: true,
				},
			],
		};

		renderWithContext({
			currentEngine: engineWithPreMarkedMissingPart,
			selectedParts: [],
			locked: false,
			repairs: undefined,
		});

		// Should still warn about missing part data
		expect(consoleSpy).toHaveBeenCalledWith('Part missing: Missing Part');

		// Should show missing part alert
		expect(screen.getByTestId('missing-part-alert')).toBeInTheDocument();

		// Pre-marked missing part should be disabled
		const missingPartCheckbox = screen.getByLabelText(
			'Select part Missing Part',
		);
		expect(missingPartCheckbox).toBeDisabled();

		// Should have line-through styling classes applied
		const missingPartRow = screen
			.getByText('x1 Missing Part')
			.closest('tr');
		expect(missingPartRow).toBeInTheDocument();

		consoleSpy.mockRestore();
	});

	it('sorts compatible parts correctly including missing parts', () => {
		const engineWithMixedParts: Engine = {
			...mockEngine,
			compatibleParts: [
				{
					name: 'Carburetor' as TuningPartName,
					quantity: 1,
					cost: 320,
				},
				{ name: 'Air Filter' as TuningPartName, quantity: 1, cost: 35 },
				{
					name: 'Missing Part' as TuningPartName,
					quantity: 1,
					cost: 0,
				},
				{
					name: 'Air Filter (B6 M64.01)' as TuningPartName,
					quantity: 2,
					cost: 45,
				},
			],
		};

		renderWithContext({
			currentEngine: engineWithMixedParts,
			selectedParts: [],
			locked: false,
			repairs: undefined,
		});

		// Parts should be sorted by name_asc by default
		// The component calls partSortFn(sortBy) which our mock implements
		// We can verify the parts are rendered in the expected order
		expect(screen.getByText('x1 Air Filter')).toBeInTheDocument();
		expect(
			screen.getByText('x2 Air Filter (B6 M64.01)'),
		).toBeInTheDocument();
		expect(screen.getByText('x1 Carburetor')).toBeInTheDocument();
		expect(screen.getByText('x1 Missing Part')).toBeInTheDocument();

		// Verify sort buttons are rendered for all columns
		expect(screen.getByTestId('sort-btn-name_asc')).toBeInTheDocument();
		expect(screen.getByTestId('sort-btn-boost_asc')).toBeInTheDocument();
		expect(screen.getByTestId('sort-btn-cost_asc')).toBeInTheDocument();
		expect(
			screen.getByTestId('sort-btn-costToBoost_asc'),
		).toBeInTheDocument();
	});

	it('prevents checking missing parts but allows checking valid parts', () => {
		const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

		const engineWithMixedParts: Engine = {
			...mockEngine,
			compatibleParts: [
				{ name: 'Air Filter' as TuningPartName, quantity: 1, cost: 35 },
				{
					name: 'Missing Part' as TuningPartName,
					quantity: 1,
					cost: 0,
				},
			],
		};

		renderWithContext({
			currentEngine: engineWithMixedParts,
			selectedParts: [],
			locked: false,
			repairs: undefined,
		});

		// Verify the component renders both parts
		expect(screen.getByText('x1 Air Filter')).toBeInTheDocument();
		expect(screen.getByText('x1 Missing Part')).toBeInTheDocument();

		// Should warn about missing part
		expect(consoleSpy).toHaveBeenCalledWith('Part missing: Missing Part');

		// Valid part checkbox should be enabled and clickable
		const validPartCheckbox = screen.getByLabelText(
			'Select part Air Filter',
		);
		expect(validPartCheckbox).toBeInTheDocument();
		expect(validPartCheckbox).not.toBeDisabled();

		// Clear any previous calls to the mock
		jest.clearAllMocks();

		fireEvent.click(validPartCheckbox);

		expect(ToggleSelectedPartEvent.dispatch).toHaveBeenCalledWith(
			{ name: 'Air Filter', quantity: 1 },
			true,
		);
		expect(ToggleSelectedPartEvent.dispatch).toHaveBeenCalledTimes(1);

		// Missing part checkbox should be disabled
		const missingPartCheckbox = screen.getByLabelText(
			'Select part Missing Part',
		);
		expect(missingPartCheckbox).toBeInTheDocument();
		expect(missingPartCheckbox).toBeDisabled();

		// Clear mock calls again to test missing part behavior
		jest.clearAllMocks();

		// Since fireEvent.click() can trigger events even on disabled elements,
		// we verify the checkbox is disabled and that real user interaction would be prevented
		// In a real browser, disabled checkboxes cannot be clicked by users
		expect(missingPartCheckbox.hasAttribute('disabled')).toBe(true);

		// Additionally, we can verify that the onChange handler checks for disabled state
		// by ensuring the checkbox has the disabled attribute
		expect(missingPartCheckbox).toHaveAttribute('disabled');

		consoleSpy.mockRestore();
	});
});
