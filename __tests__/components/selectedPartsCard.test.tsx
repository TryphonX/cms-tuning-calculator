import { render, screen } from '@testing-library/react';
import SelectedPartsCard from '@/components/selectedPartsCard/selectedPartsCard';

// Mock the Card component
jest.mock('@/components/card/card', () => {
	return function MockCard({
		title,
		className,
		children,
	}: {
		title: string;
		className?: string;
		children: React.ReactNode;
	}) {
		return (
			<div data-testid="card" className={className}>
				<h2>{title}</h2>
				{children}
			</div>
		);
	};
});

// Mock the SelectedPartsTable component
jest.mock('@/components/selectedPartsCard/selectedPartsTable', () => {
	return function MockSelectedPartsTable() {
		return (
			<div data-testid="selected-parts-table">Selected Parts Table</div>
		);
	};
});

describe('SelectedPartsCard', () => {
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

		const card = screen.getByTestId('card');
		expect(card).toHaveClass(customClass);
	});

	it('renders with proper structure', () => {
		render(<SelectedPartsCard />);

		const card = screen.getByTestId('card');
		expect(card).toBeInTheDocument();

		// Check that the table is wrapped in a div with mt-4 class
		const tableContainer = screen.getByTestId(
			'selected-parts-table',
		).parentElement;
		expect(tableContainer).toBeInTheDocument();
	});

	it('renders without errors when no props are provided', () => {
		expect(() => render(<SelectedPartsCard />)).not.toThrow();
	});
});
