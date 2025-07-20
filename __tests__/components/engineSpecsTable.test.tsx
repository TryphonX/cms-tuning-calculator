import { render, screen } from '@testing-library/react';
import EngineSpecsTable from '@/components/engineCard/engineSpecsTable';
import { CalculatorContext } from '@/modules/contexts';
import { Engine, EngineName } from '@/@types/calculator';

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
	currentEngine: mockEngine,
	selectedParts: [],
};

const renderWithContext = (contextValue = defaultContextValue) => {
	return render(
		<CalculatorContext.Provider value={contextValue}>
			<EngineSpecsTable />
		</CalculatorContext.Provider>,
	);
};

describe('EngineSpecsTable', () => {
	it('renders specs table when currentEngine is set', () => {
		renderWithContext();

		const table = screen.getByRole('table');
		expect(table).toBeInTheDocument();
	});

	it('displays power specification correctly', () => {
		renderWithContext();

		expect(screen.getByText('Power')).toBeInTheDocument();
		expect(screen.getByText('246')).toBeInTheDocument();
	});

	it('displays torque specification correctly', () => {
		renderWithContext();

		expect(screen.getByText('Torque')).toBeInTheDocument();
		expect(screen.getByText('194')).toBeInTheDocument();
	});

	it('displays gearbox specification correctly', () => {
		renderWithContext();

		expect(screen.getByText('Gearbox')).toBeInTheDocument();
		expect(screen.getByText('Gearbox (CHRG-eE1)')).toBeInTheDocument();
	});

	it('applies correct CSS classes for responsiveness to the container', () => {
		renderWithContext();

		const figure = screen.getByRole('table').closest('figure');
		expect(figure).toHaveClass('col-span-3', 'sm:col-span-2');
	});

	it('does not render when no currentEngine is set', () => {
		renderWithContext({
			currentEngine: null as unknown as Engine,
			selectedParts: [],
		});

		expect(screen.queryByRole('table')).not.toBeInTheDocument();
	});

	it('updates specs when engine changes', () => {
		const { rerender } = renderWithContext();

		// Verify initial specs
		expect(screen.getByText('246')).toBeInTheDocument();
		expect(screen.getByText('194')).toBeInTheDocument();
		expect(screen.getByText('Gearbox (CHRG-eE1)')).toBeInTheDocument();

		// Change engine
		const newEngine: Engine = {
			...mockEngine,
			name: 'I4 DOHC' as EngineName,
			specs: {
				power: '180',
				torque: '160',
				gearbox: 'Manual',
				configuration: 'I4',
			},
		};

		rerender(
			<CalculatorContext.Provider
				value={{
					currentEngine: newEngine,
					selectedParts: [],
				}}
			>
				<EngineSpecsTable />
			</CalculatorContext.Provider>,
		);

		// Verify updated specs
		expect(screen.getByText('180')).toBeInTheDocument();
		expect(screen.getByText('160')).toBeInTheDocument();
		expect(screen.getByText('Manual')).toBeInTheDocument();
	});

	it('handles undefined currentEngine gracefully', () => {
		renderWithContext({
			currentEngine: undefined as unknown as Engine,
			selectedParts: [],
		});

		expect(screen.queryByRole('table')).not.toBeInTheDocument();
	});

	it('renders table headers correctly', () => {
		renderWithContext();

		// Check that the spec names are rendered as table headers
		const powerHeader = screen.getByText('Power').closest('th');
		const torqueHeader = screen.getByText('Torque').closest('th');
		const gearboxHeader = screen.getByText('Gearbox').closest('th');

		expect(powerHeader).toBeInTheDocument();
		expect(torqueHeader).toBeInTheDocument();
		expect(gearboxHeader).toBeInTheDocument();
	});

	it('renders spec values in table cells', () => {
		renderWithContext();

		// Check that the spec values are in td elements
		const powerValue = screen.getByText('246').closest('td');
		const torqueValue = screen.getByText('194').closest('td');
		const gearboxValue = screen
			.getByText('Gearbox (CHRG-eE1)')
			.closest('td');

		expect(powerValue).toBeInTheDocument();
		expect(torqueValue).toBeInTheDocument();
		expect(gearboxValue).toBeInTheDocument();
	});

	it('maintains table structure with tbody', () => {
		renderWithContext();

		const tbody = screen.getByRole('table').querySelector('tbody');
		expect(tbody).toBeInTheDocument();

		// Should have exactly 3 rows (Power, Torque, Gearbox)
		const rows = tbody?.querySelectorAll('tr');
		expect(rows).toHaveLength(3);
	});

	it('handles engines with different spec formats', () => {
		const engineWithDifferentSpecs: Engine = {
			...mockEngine,
			specs: {
				power: '500 HP',
				torque: '600 Nm',
				gearbox: 'Automatic CVT',
				configuration: 'V8',
			},
		};

		renderWithContext({
			currentEngine: engineWithDifferentSpecs,
			selectedParts: [],
		});

		expect(screen.getByText('500 HP')).toBeInTheDocument();
		expect(screen.getByText('600 Nm')).toBeInTheDocument();
		expect(screen.getByText('Automatic CVT')).toBeInTheDocument();
	});
});
