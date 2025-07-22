import { fireEvent, render, screen } from '@testing-library/react';
import SelectedPartsCard from '@/components/SelectedPartsCard';
import {
	Engine,
	SelectedPart,
	TuningPartName,
	TuningSetup,
} from '@/@types/calculator';
import { CalculatorContext } from '@/modules/contexts';
import { useContext } from 'react';
import { UnlockEvent } from '@/modules/customEvents';

// Mock the UnlockEvent
jest.mock('@/modules/customEvents', () => ({
	UnlockEvent: {
		dispatch: jest.fn(),
	},
}));

// Get reference to the mocked function
const mockUnlockDispatch = UnlockEvent.dispatch as jest.MockedFunction<
	typeof UnlockEvent.dispatch
>;

const TestConsumer = () => {
	const context = useContext(CalculatorContext);

	return (
		<div data-testid="state" data-state={JSON.stringify(context)}>
			{context.locked && <span>Locked</span>}
		</div>
	);
};

const renderWithContext = (
	engine?: Engine,
	parts?: SelectedPart[],
	repairs?: TuningSetup['repairs'],
) => {
	const contextValue = {
		currentEngine: engine ?? null,
		selectedParts: parts ?? [],
		locked: !!repairs,
		repairs: repairs,
	};

	return render(
		<CalculatorContext.Provider value={contextValue}>
			<SelectedPartsCard />
			<TestConsumer />
		</CalculatorContext.Provider>,
	);
};

// Mock the SelectedPartsTable component
jest.mock('@/components/SelectedPartsCard/SelectedPartsTable', () => {
	return function MockSelectedPartsTable() {
		return (
			<div data-testid="selected-parts-table">Selected Parts Table</div>
		);
	};
});

describe('SelectedPartsCard', () => {
	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks();
	});

	it('renders the card with correct title', () => {
		render(<SelectedPartsCard />);

		expect(screen.getByText('Cart')).toBeInTheDocument();
	});

	it('renders the SelectedPartsTable component', () => {
		render(<SelectedPartsCard />);

		expect(screen.getByTestId('selected-parts-table')).toBeInTheDocument();
	});

	it('applies custom className when provided', () => {
		const customClass = 'custom-test-class';
		render(<SelectedPartsCard className={customClass} />);

		const card = document.querySelector('.card');
		expect(card).toHaveClass(customClass);
	});

	it('renders without errors when no props are provided', () => {
		expect(() => render(<SelectedPartsCard />)).not.toThrow();
	});

	it('dispatches UnlockEvent when unlock button is clicked', () => {
		const mockRepairs: TuningSetup['repairs'] = {
			netCostToBoost: 500,
			repairPartNames: ['test-part-1' as TuningPartName],
			netCost: 1000,
			totalSaved: 200,
		};

		renderWithContext(undefined, undefined, mockRepairs);

		// Check if the locked state is rendered
		expect(
			JSON.parse(screen.getByTestId('state').dataset.state as string)
				.locked,
		).toBe(true);

		const unlockBtn = screen.getByRole('button');

		// Expect the unlock button to be present and enabled
		expect(unlockBtn).toBeInTheDocument();
		expect(unlockBtn).not.toBeDisabled();

		// Verify UnlockEvent hasn't been called yet
		expect(mockUnlockDispatch).not.toHaveBeenCalled();

		// Click the button
		fireEvent.click(unlockBtn);

		// Verify the UnlockEvent was dispatched
		expect(mockUnlockDispatch).toHaveBeenCalled();
		expect(mockUnlockDispatch).toHaveBeenCalledTimes(1);
	});

	it('shows unlock button when locked', () => {
		const mockRepairs: TuningSetup['repairs'] = {
			netCostToBoost: 500,
			repairPartNames: ['test-part-1' as TuningPartName],
			netCost: 1000,
			totalSaved: 200,
		};

		renderWithContext(undefined, undefined, mockRepairs);

		const unlockBtn = screen.getByRole('button');
		expect(unlockBtn).toBeInTheDocument();
	});

	it('disables unlock button when not locked', () => {
		// Render without repairs (unlocked state)
		renderWithContext();

		// Should have a disabled unlock button when unlocked
		const unlockBtn = screen.getByRole('button');
		expect(unlockBtn).toBeInTheDocument();
		expect(unlockBtn).toBeDisabled();
	});
});
