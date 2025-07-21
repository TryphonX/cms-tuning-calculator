import { render, screen, fireEvent } from '@testing-library/react';
import AutoGenModalSetupScreen from '@/components/AutoGenModal/AutoGenModalSetupScreen';
import { TuningSetup, TuningPartName } from '@/@types/calculator';

// Mock the react-icons components
jest.mock('react-icons/fa6', () => ({
	FaArrowRotateLeft: () => <span data-testid="rotate-left-icon" />,
	FaArrowsRotate: () => <span data-testid="arrows-rotate-icon" />,
}));

const mockTuningSetup: TuningSetup = {
	boost: 15.5,
	cost: 500,
	costToBoost: 32.26,
	partNames: ['Air Filter' as TuningPartName, 'Carburetor' as TuningPartName],
};

const mockTuningSetupWithRepairs: TuningSetup = {
	boost: 20.0,
	cost: 800,
	costToBoost: 40.0,
	partNames: [
		'Air Filter' as TuningPartName,
		'Turbocharger' as TuningPartName,
	],
	repairs: {
		includesRepairParts: true,
		netCost: 650,
		netCostToBoost: 32.5,
		totalSaved: 150,
		repairPartNames: ['Air Filter', 'Turbocharger'],
	},
};

describe('AutoGenModalSetupScreen', () => {
	const mockOnApply = jest.fn();
	const mockOnDiscard = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders setup data when generatedSetup is provided', () => {
		render(
			<AutoGenModalSetupScreen
				generatedSetup={mockTuningSetup}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		expect(screen.getByText('15.50%')).toBeInTheDocument();
		expect(screen.getByText('500 CR')).toBeInTheDocument();
		expect(screen.getByText('32.26 CR / Boost')).toBeInTheDocument();
	});

	it('renders "no possible setup" message when generatedSetup is null', () => {
		render(
			<AutoGenModalSetupScreen
				generatedSetup={null}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		expect(
			screen.getByText('There is no possible setup configuration.'),
		).toBeInTheDocument();
	});

	it('renders "no possible setup" message when generatedSetup is undefined', () => {
		render(
			<AutoGenModalSetupScreen
				generatedSetup={undefined}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		expect(
			screen.getByText('There is no possible setup configuration.'),
		).toBeInTheDocument();
	});

	it('renders table with correct headers', () => {
		render(
			<AutoGenModalSetupScreen
				generatedSetup={mockTuningSetup}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		expect(screen.getByText('Boost')).toBeInTheDocument();
		expect(screen.getByText('Cost')).toBeInTheDocument();
		expect(screen.getByText('Cost / Boost')).toBeInTheDocument();
	});

	it('renders action buttons', () => {
		render(
			<AutoGenModalSetupScreen
				generatedSetup={mockTuningSetup}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		expect(screen.getByText('Discard')).toBeInTheDocument();
		expect(screen.getByText('Apply changes')).toBeInTheDocument();
		expect(screen.getByTestId('rotate-left-icon')).toBeInTheDocument();
		expect(screen.getByTestId('arrows-rotate-icon')).toBeInTheDocument();
	});

	it('calls onDiscard when discard button is clicked', () => {
		render(
			<AutoGenModalSetupScreen
				generatedSetup={mockTuningSetup}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		const discardBtn = screen.getByText('Discard');
		fireEvent.click(discardBtn);

		expect(mockOnDiscard).toHaveBeenCalledTimes(1);
		expect(mockOnApply).not.toHaveBeenCalled();
	});

	it('calls onApply when apply button is clicked', () => {
		render(
			<AutoGenModalSetupScreen
				generatedSetup={mockTuningSetup}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		const applyBtn = screen.getByText('Apply changes');
		fireEvent.click(applyBtn);

		expect(mockOnApply).toHaveBeenCalledTimes(1);
		expect(mockOnDiscard).not.toHaveBeenCalled();
	});

	it('disables apply button when no generatedSetup is provided', () => {
		render(
			<AutoGenModalSetupScreen
				generatedSetup={null}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		const applyBtn = screen.getByText('Apply changes');
		expect(applyBtn).toBeDisabled();
	});

	it('enables apply button when generatedSetup is provided', () => {
		render(
			<AutoGenModalSetupScreen
				generatedSetup={mockTuningSetup}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		const applyBtn = screen.getByText('Apply changes');
		expect(applyBtn).not.toBeDisabled();
	});

	it('renders repair information when setup includes repairs', () => {
		render(
			<AutoGenModalSetupScreen
				generatedSetup={mockTuningSetupWithRepairs}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		// Should show net cost instead of original cost
		expect(screen.getByText('650 CR')).toBeInTheDocument();
		expect(screen.getByText('800 CR')).toBeInTheDocument(); // Original cost should be crossed out

		// Should show net cost to boost
		expect(screen.getByText('32.50 CR / Boost')).toBeInTheDocument();
		expect(screen.getByText('40.00 CR / Boost')).toBeInTheDocument(); // Original cost to boost

		// Should show savings badges
		expect(screen.getByText('-150 CR *')).toBeInTheDocument();
		expect(screen.getByText('-7.50 CR / Boost *')).toBeInTheDocument();

		// Should show repair explanation
		expect(
			screen.getByText(/Some parts were repaired in this setup/),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Repairing: Air Filter, Turbocharger/),
		).toBeInTheDocument();
	});

	it('does not render repair information when setup does not include repairs', () => {
		render(
			<AutoGenModalSetupScreen
				generatedSetup={mockTuningSetup}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		// Should show only original cost
		expect(screen.getByText('500 CR')).toBeInTheDocument();
		expect(screen.queryByText('650 CR')).not.toBeInTheDocument();

		// Should not show repair explanation
		expect(
			screen.queryByText(/Some parts were repaired in this setup/),
		).not.toBeInTheDocument();
		expect(screen.queryByText(/Repairing:/)).not.toBeInTheDocument();
	});

	it('renders correct aria labels for savings badges', () => {
		render(
			<AutoGenModalSetupScreen
				generatedSetup={mockTuningSetupWithRepairs}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		const costSavingsBadge = screen.getByLabelText(
			'Total saved after repairs: 150 CR',
		);
		expect(costSavingsBadge).toBeInTheDocument();

		const costToBoostSavingsBadge = screen.getByLabelText(
			'Total saved CR per boost after repairs: 7.50 CR',
		);
		expect(costToBoostSavingsBadge).toBeInTheDocument();
	});

	it('renders screen reader text for cost elements', () => {
		render(
			<AutoGenModalSetupScreen
				generatedSetup={mockTuningSetupWithRepairs}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		expect(screen.getByText('Original cost was')).toBeInTheDocument();
		expect(screen.getByText('New cost is')).toBeInTheDocument();
		expect(
			screen.getByText('Original cost per boost was'),
		).toBeInTheDocument();
		expect(screen.getByText('New cost per boost is')).toBeInTheDocument();
	});

	it('formats boost value with two decimal places', () => {
		const setupWithVariousBoost: TuningSetup = {
			...mockTuningSetup,
			boost: 12.345,
		};

		render(
			<AutoGenModalSetupScreen
				generatedSetup={setupWithVariousBoost}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		expect(screen.getByText('12.35%')).toBeInTheDocument();
	});

	it('formats cost-to-boost ratio with two decimal places', () => {
		const setupWithVariousCostToBoost: TuningSetup = {
			...mockTuningSetup,
			costToBoost: 45.678,
		};

		render(
			<AutoGenModalSetupScreen
				generatedSetup={setupWithVariousCostToBoost}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		expect(screen.getByText('45.68 CR / Boost')).toBeInTheDocument();
	});

	it('calculates and displays repair savings correctly', () => {
		const setupWithSpecificSavings: TuningSetup = {
			boost: 25.0,
			cost: 1000,
			costToBoost: 40.0,
			partNames: ['Air Filter' as TuningPartName],
			repairs: {
				includesRepairParts: true,
				netCost: 750,
				netCostToBoost: 30.0,
				totalSaved: 250,
				repairPartNames: ['Air Filter'],
			},
		};

		render(
			<AutoGenModalSetupScreen
				generatedSetup={setupWithSpecificSavings}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		// Verify cost savings calculation: original (40.0) - net (30.0) = 10.0
		expect(screen.getByText('-10.00 CR / Boost *')).toBeInTheDocument();
		expect(screen.getByText('-250 CR *')).toBeInTheDocument();
	});

	it('handles empty repair part names array', () => {
		const setupWithEmptyRepairNames: TuningSetup = {
			...mockTuningSetupWithRepairs,
			repairs: {
				...mockTuningSetupWithRepairs.repairs!,
				repairPartNames: [],
			},
		};

		render(
			<AutoGenModalSetupScreen
				generatedSetup={setupWithEmptyRepairNames}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		expect(screen.getByText('Repairing:')).toBeInTheDocument();
	});

	it('handles single repair part name', () => {
		const setupWithSingleRepairName: TuningSetup = {
			...mockTuningSetupWithRepairs,
			repairs: {
				...mockTuningSetupWithRepairs.repairs!,
				repairPartNames: ['Air Filter'],
			},
		};

		render(
			<AutoGenModalSetupScreen
				generatedSetup={setupWithSingleRepairName}
				onApply={mockOnApply}
				onDiscard={mockOnDiscard}
			/>,
		);

		expect(screen.getByText('Repairing: Air Filter')).toBeInTheDocument();
	});
});
