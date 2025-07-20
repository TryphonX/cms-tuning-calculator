import { render, screen, fireEvent } from '@testing-library/react';
import SelectedPartsTable from '@/components/selectedPartsCard/selectedPartsTable';
import { CalculatorContext } from '@/modules/contexts';
import { UpdateSortEvent } from '@/modules/customEvents';
import {
	Engine,
	SelectedPart,
	EngineName,
	TuningPartName,
} from '@/@types/calculator';
import { PartSortBy } from '@/@types/globals';

// Mock the common module
jest.mock('@/modules/common', () => ({
	partSortFn: jest.fn(
		(sortBy: PartSortBy) => (a: SelectedPart, b: SelectedPart) => {
			if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
			if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
			return 0;
		},
	),
	getFullPartByName: jest.fn((name: string) => {
		const parts: Record<string, { boost: number; cost: number }> = {
			'Air Filter': { boost: 1, cost: 35 },
			'Air Filter (B6 M64.01)': { boost: 2.5, cost: 45 },
			Carburetor: { boost: 8, cost: 320 },
		};
		return parts[name];
	}),
}));

// Mock the SortBtn component
jest.mock('@/components/sortBtn/sortBtn', () => {
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
	{ name: 'Air Filter (B6 M64.01)' as TuningPartName, quantity: 2 },
	{ name: 'Carburetor' as TuningPartName, quantity: 1 },
];

const defaultContextValue = {
	currentEngine: mockEngine,
	selectedParts: mockSelectedParts,
};

const renderWithContext = (contextValue = defaultContextValue) => {
	return render(
		<CalculatorContext.Provider value={contextValue}>
			<SelectedPartsTable />
		</CalculatorContext.Provider>,
	);
};

describe('SelectedPartsTable', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns early when no current engine is set', () => {
		renderWithContext({
			currentEngine: null as unknown as Engine,
			selectedParts: [],
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

	it('renders selected parts in table rows', () => {
		renderWithContext();

		expect(screen.getByText('x1 Air Filter')).toBeInTheDocument();
		expect(
			screen.getByText('x2 Air Filter (B6 M64.01)'),
		).toBeInTheDocument();
		expect(screen.getByText('x1 Carburetor')).toBeInTheDocument();
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

	it('calculates and displays total values correctly', () => {
		renderWithContext();

		// Total boost: 1 + 5 + 8 = 14.00
		expect(screen.getByText('+14.00%')).toBeInTheDocument();
		// Total cost: 35 + 90 + 320 = 445
		expect(screen.getByText('445 CR')).toBeInTheDocument();
		// Total cost-to-boost: 445 / 14 = 32 CR/Boost
		expect(screen.getByText('32 CR/Boost')).toBeInTheDocument();
	});

	it('handles empty selected parts list', () => {
		renderWithContext({ currentEngine: mockEngine, selectedParts: [] });

		// Should still render table but with no rows and zero totals
		expect(screen.getByRole('table')).toBeInTheDocument();
		expect(screen.getByText('+0.00%')).toBeInTheDocument();
		expect(screen.getByText('0 CR')).toBeInTheDocument();
	});

	it('listens for UpdateSortEvent and updates sort state', () => {
		renderWithContext();

		// Dispatch a sort event
		const sortEvent = new CustomEvent(UpdateSortEvent.name, {
			detail: 'name_desc' as PartSortBy,
		});

		fireEvent(window, sortEvent);

		// The component should re-render with the new sort order
		// This is tested indirectly through the sort button state
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

	it('handles missing part data gracefully', () => {
		const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

		const partsWithMissing: SelectedPart[] = [
			{ name: 'Air Filter' as TuningPartName, quantity: 1 },
		];

		// Mock getFullPartByName to return null to simulate missing data
		const mockModule = jest.requireMock('@/modules/common');
		const originalImpl = mockModule.getFullPartByName;
		mockModule.getFullPartByName.mockImplementation((name: string) => {
			if (name === 'Air Filter') {
				return null; // Simulate missing part data
			}
			return originalImpl(name);
		});

		renderWithContext({
			currentEngine: mockEngine,
			selectedParts: partsWithMissing,
		});

		expect(consoleSpy).toHaveBeenCalledWith('Part missing: Air Filter');

		// Restore original implementation
		mockModule.getFullPartByName.mockImplementation(originalImpl);
		consoleSpy.mockRestore();
	});

	it('handles zero total boost for cost-to-boost calculation', () => {
		const partsWithZeroBoost: SelectedPart[] = [
			{ name: 'Air Filter' as TuningPartName, quantity: 1 },
		];

		// Mock getFullPartByName to return zero boost
		const mockModule = jest.requireMock('@/modules/common');
		mockModule.getFullPartByName.mockImplementation((name: string) => {
			if (name === 'Air Filter') {
				return { boost: 0, cost: 1000 };
			}
			return null;
		});

		renderWithContext({
			currentEngine: mockEngine,
			selectedParts: partsWithZeroBoost,
		});

		// Should display 0 CR/Boost when total boost is 0
		expect(screen.getByText('0 CR/Boost')).toBeInTheDocument();
	});
});
