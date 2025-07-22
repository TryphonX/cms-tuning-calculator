import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AutoGenModalInitialScreen from '@/components/AutoGenModal/AutoGenModalInitialScreen';
import { RepairParts } from '@/@types/calculator';

// Mock the RepairPartsTable component
jest.mock('@/components/AutoGenModal/RepairPartsTable', () => {
	return function MockRepairPartsTable({
		onRepairPartsChange,
	}: {
		onRepairPartsChange: (parts: RepairParts) => void;
	}) {
		return (
			<div data-testid="repair-parts-table">
				Mock Repair Parts Table
				<button
					onClick={() =>
						onRepairPartsChange({
							'Air Filter': -35,
							Carburetor: -320,
						} as unknown as RepairParts)
					}
					data-testid="change-repair-parts"
				>
					Change Repair Parts
				</button>
			</div>
		);
	};
});

// Mock react-icons
jest.mock('react-icons/fa6', () => ({
	FaWandMagicSparkles: () => <span data-testid="magic-icon">Magic Icon</span>,
}));

const defaultProps = {
	onTargetChange: jest.fn(),
	targetIncrease: 50,
	onGenerate: jest.fn(),
	onRepairPartsChange: jest.fn(),
	repairParts: {} as RepairParts,
};

describe('AutoGenModalInitialScreen', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the component with all elements', () => {
		render(<AutoGenModalInitialScreen {...defaultProps} />);

		expect(
			screen.getByText(/Auto-generation will show you the optimal setup/),
		).toBeInTheDocument();
		expect(
			screen.getByText('Choose your target boost increase:'),
		).toBeInTheDocument();
		expect(screen.getByText('Target Increase: 50%')).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /Generate/ }),
		).toBeInTheDocument();
	});

	it('renders the RepairPartsTable component', () => {
		render(<AutoGenModalInitialScreen {...defaultProps} />);

		expect(screen.getByTestId('repair-parts-table')).toBeInTheDocument();
	});

	it('renders the range input with correct attributes', () => {
		render(<AutoGenModalInitialScreen {...defaultProps} />);

		const rangeInput = screen.getByRole('slider');
		expect(rangeInput).toHaveAttribute('min', '0');
		expect(rangeInput).toHaveAttribute('max', '100');
		expect(rangeInput).toHaveAttribute('value', '50');
	});

	it('calls onTargetChange when range input changes', () => {
		render(<AutoGenModalInitialScreen {...defaultProps} />);

		const rangeInput = screen.getByRole('slider');
		fireEvent.change(rangeInput, { target: { value: '75' } });

		expect(defaultProps.onTargetChange).toHaveBeenCalledTimes(1);
	});

	it('calls onGenerate when Generate button is clicked', () => {
		render(<AutoGenModalInitialScreen {...defaultProps} />);

		const generateButton = screen.getByRole('button', { name: /Generate/ });
		fireEvent.click(generateButton);

		expect(defaultProps.onGenerate).toHaveBeenCalledTimes(1);
	});

	it('calls onRepairPartsChange when RepairPartsTable triggers change', () => {
		render(<AutoGenModalInitialScreen {...defaultProps} />);

		const changeButton = screen.getByTestId('change-repair-parts');
		fireEvent.click(changeButton);

		expect(defaultProps.onRepairPartsChange).toHaveBeenCalledWith({
			'Air Filter': -35,
			Carburetor: -320,
		});
	});

	it('renders range scale markers correctly', () => {
		render(<AutoGenModalInitialScreen {...defaultProps} />);

		// Check that major markers (every 20%) are visible
		expect(screen.getByText('0%')).toBeInTheDocument();
		expect(screen.getByText('20%')).toBeInTheDocument();
		expect(screen.getByText('40%')).toBeInTheDocument();
		expect(screen.getByText('60%')).toBeInTheDocument();
		expect(screen.getByText('80%')).toBeInTheDocument();
		expect(screen.getByText('100%')).toBeInTheDocument();
	});

	it('displays correct target increase value', () => {
		const customProps = { ...defaultProps, targetIncrease: 75 };
		render(<AutoGenModalInitialScreen {...customProps} />);

		expect(screen.getByText('Target Increase: 75%')).toBeInTheDocument();
	});

	it('renders the magic icon in the generate button', () => {
		render(<AutoGenModalInitialScreen {...defaultProps} />);

		expect(screen.getByTestId('magic-icon')).toBeInTheDocument();
	});

	it('handles zero target increase correctly', () => {
		const customProps = { ...defaultProps, targetIncrease: 0 };
		render(<AutoGenModalInitialScreen {...customProps} />);

		expect(screen.getByText('Target Increase: 0%')).toBeInTheDocument();
	});

	it('handles maximum target increase correctly', () => {
		const customProps = { ...defaultProps, targetIncrease: 100 };
		render(<AutoGenModalInitialScreen {...customProps} />);

		expect(screen.getByText('Target Increase: 100%')).toBeInTheDocument();
	});
});
