import React from 'react';
import { render, screen } from '@testing-library/react';
import SelectedPartsTable from '@/components/SelectedPartsCard/SelectedPartsTable';
import { CalculatorContext } from '@/modules/contexts';
import {
	Engine,
	EngineName,
	SelectedPart,
	TuningPart,
	TuningPartName,
} from '@/@types/calculator';

// Simple mock for SortBtn
jest.mock('@/components/sortBtn/sortBtn', () => {
	return function MockSortBtn() {
		return <span>Sort Button</span>;
	};
});

// Simple mock for common module
jest.mock('@/modules/common', () => ({
	getFullPartByName: jest.fn((name: string) => {
		const parts: Partial<Record<TuningPartName, TuningPart>> = {
			['test-part-1' as TuningPartName]: {
				boost: 10,
				cost: 100,
				costToBoost: 10,
			},
			['test-part-2' as TuningPartName]: {
				boost: 20,
				cost: 200,
				costToBoost: 20,
			},
		};
		return parts[name as TuningPartName];
	}),
	partSortFn: jest.fn(() => () => 0),
}));

// Mock engine
const mockEngine: Engine = {
	name: 'TestEngine' as EngineName,
	specs: {
		configuration: 'V8',
		power: '300',
		torque: '400',
		gearbox: 'Manual',
	},
	compatibleParts: [
		{
			name: 'test-part-1' as TuningPartName,
			quantity: 2,
			cost: 100,
		},
	],
	imgUrl: '/test-engine.jpg',
};

// Mock selected parts
const mockSelectedParts: SelectedPart[] = [
	{ name: 'test-part-1' as TuningPartName, quantity: 2 },
];

const renderWithContext = (engine?: Engine, parts?: SelectedPart[]) => {
	const contextValue = {
		currentEngine: engine || null,
		selectedParts: parts || [],
		setCurrentEngine: jest.fn(),
		setSelectedParts: jest.fn(),
	};

	return render(
		<CalculatorContext.Provider value={contextValue}>
			<SelectedPartsTable />
		</CalculatorContext.Provider>,
	);
};

describe('SelectedPartsTable', () => {
	it('returns early when no current engine is set', () => {
		const { container } = renderWithContext();
		expect(container.firstChild).toBeNull();
	});

	it('renders the table with correct headers', () => {
		renderWithContext(mockEngine, mockSelectedParts);

		expect(screen.getByText('Part')).toBeInTheDocument();
		expect(screen.getByText('Boost')).toBeInTheDocument();
		expect(screen.getByText('Cost')).toBeInTheDocument();
		expect(screen.getByText('Cost / Boost')).toBeInTheDocument();
	});

	it('renders selected parts in table rows', () => {
		renderWithContext(mockEngine, mockSelectedParts);

		expect(screen.getByText('x2 test-part-1')).toBeInTheDocument();
	});

	it('calculates and displays boost values correctly', () => {
		const { container } = renderWithContext(mockEngine, mockSelectedParts);

		// Look for boost value in the table body (tbody)
		const tbody = container.querySelector('tbody');
		expect(tbody?.textContent).toContain('+20.00%'); // 10 * 2
	});

	it('calculates and displays cost values correctly', () => {
		const { container } = renderWithContext(mockEngine, mockSelectedParts);

		// Look for cost value in the table body (tbody)
		const tbody = container.querySelector('tbody');
		expect(tbody?.textContent).toContain('200 CR'); // 100 * 2
	});

	it('displays total values correctly', () => {
		const { container } = renderWithContext(mockEngine, mockSelectedParts);

		expect(screen.getByText('Total:')).toBeInTheDocument();

		// Look for total values in the table footer (tfoot)
		const tfoot = container.querySelector('tfoot');
		expect(tfoot?.textContent).toContain('+20.00%');
		expect(tfoot?.textContent).toContain('200 CR');
	});

	it('handles empty selected parts list', () => {
		renderWithContext(mockEngine, []);

		expect(screen.getByText('Total:')).toBeInTheDocument();
		expect(screen.getByText('+0.00%')).toBeInTheDocument();
		expect(screen.getByText('0 CR')).toBeInTheDocument();
	});

	it('handles multiple parts correctly', () => {
		const multiParts: SelectedPart[] = [
			{ name: 'test-part-1' as TuningPartName, quantity: 1 },
			{ name: 'test-part-2' as TuningPartName, quantity: 1 },
		];

		renderWithContext(mockEngine, multiParts);

		expect(screen.getByText('x1 test-part-1')).toBeInTheDocument();
		expect(screen.getByText('x1 test-part-2')).toBeInTheDocument();
	});
});
