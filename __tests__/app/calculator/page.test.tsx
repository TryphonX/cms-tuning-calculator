import { render, screen } from '@testing-library/react';
import Calculator from '@/app/calculator/page';

// Mock the child components
jest.mock('@/components/calculatorWrapper/calculatorWrapper', () => {
	return function MockCalculatorWrapper({
		children,
	}: {
		children: React.ReactNode;
	}) {
		return <div data-testid="calculator-wrapper">{children}</div>;
	};
});

jest.mock('@/components/engineCard/engineCard', () => {
	return function MockEngineCard() {
		return <div data-testid="engine-card">Engine Card</div>;
	};
});

jest.mock('@/components/selectedPartsCard/selectedPartsCard', () => {
	return function MockSelectedPartsCard({
		className,
	}: {
		className?: string;
	}) {
		return (
			<div data-testid="selected-parts-card" className={className}>
				Selected Parts Card
			</div>
		);
	};
});

jest.mock('@/components/compatiblePartsCard/compatiblePartsCard', () => {
	return function MockCompatiblePartsCard({
		className,
	}: {
		className?: string;
	}) {
		return (
			<div data-testid="compatible-parts-card" className={className}>
				Compatible Parts Card
			</div>
		);
	};
});

describe('Calculator Page', () => {
	it('renders the calculator page with correct components', () => {
		render(<Calculator />);

		expect(screen.getByTestId('calculator-wrapper')).toBeInTheDocument();
		expect(screen.getByTestId('engine-card')).toBeInTheDocument();
		expect(screen.getAllByTestId('selected-parts-card')).toHaveLength(2);
		expect(screen.getAllByTestId('compatible-parts-card')).toHaveLength(2);
	});

	it('renders hidden h1 heading for accessibility', () => {
		render(<Calculator />);

		const heading = screen.getByRole('heading', { level: 1 });
		expect(heading).toBeInTheDocument();
		expect(heading).toHaveTextContent('Calculator');
		expect(heading).toHaveClass('hidden');
	});

	it('applies correct column spans and responsive classes', () => {
		render(<Calculator />);

		const selectedPartsCards = screen.getAllByTestId('selected-parts-card');
		const compatiblePartsCards = screen.getAllByTestId(
			'compatible-parts-card',
		);

		// First SelectedPartsCard should have max-xl:hidden
		expect(selectedPartsCards[0]).toHaveClass('max-xl:hidden');

		// Second SelectedPartsCard should have xl:hidden
		expect(selectedPartsCards[1]).toHaveClass('xl:hidden');

		// First CompatiblePartsCard should have xl:hidden
		expect(compatiblePartsCards[0]).toHaveClass('xl:hidden');

		// Second CompatiblePartsCard should have max-xl:hidden
		expect(compatiblePartsCards[1]).toHaveClass('max-xl:hidden');
	});

	it('has correct responsive behavior classes', () => {
		render(<Calculator />);

		const selectedPartsCards = screen.getAllByTestId('selected-parts-card');
		const compatiblePartsCards = screen.getAllByTestId(
			'compatible-parts-card',
		);

		// Desktop layout: SelectedPartsCard in left column, CompatiblePartsCard in right column
		expect(
			selectedPartsCards.find((card) =>
				card.className?.includes('max-xl:hidden'),
			),
		).toBeInTheDocument();
		expect(
			compatiblePartsCards.find((card) =>
				card.className?.includes('max-xl:hidden'),
			),
		).toBeInTheDocument();

		// Mobile layout: reverse order
		expect(
			selectedPartsCards.find((card) =>
				card.className?.includes('xl:hidden'),
			),
		).toBeInTheDocument();
		expect(
			compatiblePartsCards.find((card) =>
				card.className?.includes('xl:hidden'),
			),
		).toBeInTheDocument();
	});
});
