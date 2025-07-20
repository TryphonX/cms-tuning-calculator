/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import EngineCard from '@/components/engineCard/engineCard';

// Mock child components
jest.mock('@/components/card/card', () => {
	const MockCard = ({
		title,
		children,
	}: {
		title: string;
		children: React.ReactNode;
	}) => (
		<div data-testid="card" data-title={title}>
			{children}
		</div>
	);
	MockCard.displayName = 'MockCard';
	return MockCard;
});

jest.mock('@/components/engineCard/engineImage', () => {
	const MockEngineImage = () => <div data-testid="engine-image" />;
	MockEngineImage.displayName = 'MockEngineImage';
	return MockEngineImage;
});

jest.mock('@/components/engineCard/engineSelect', () => {
	const MockEngineSelect = ({ className }: { className?: string }) => (
		<div data-testid="engine-select" className={className} />
	);
	MockEngineSelect.displayName = 'MockEngineSelect';
	return MockEngineSelect;
});

jest.mock('@/components/engineCard/engineSpecsTable', () => {
	const MockEngineSpecsTable = () => <div data-testid="engine-specs-table" />;
	MockEngineSpecsTable.displayName = 'MockEngineSpecsTable';
	return MockEngineSpecsTable;
});

describe('EngineCard', () => {
	it('renders without crashing', () => {
		render(<EngineCard />);
		expect(screen.getByTestId('card')).toBeInTheDocument();
	});

	it('renders Card component with correct title', () => {
		render(<EngineCard />);
		const card = screen.getByTestId('card');
		expect(card).toHaveAttribute('data-title', 'Engine');
	});

	it('renders EngineSelect component', () => {
		render(<EngineCard />);
		expect(screen.getByTestId('engine-select')).toBeInTheDocument();
	});

	it('renders EngineImage component', () => {
		render(<EngineCard />);
		expect(screen.getByTestId('engine-image')).toBeInTheDocument();
	});

	it('renders EngineSpecsTable component', () => {
		render(<EngineCard />);
		expect(screen.getByTestId('engine-specs-table')).toBeInTheDocument();
	});

	it('EngineSelect rendered', () => {
		render(<EngineCard />);
		const engineSelect = screen.getByTestId('engine-select');
		expect(engineSelect).toBeInTheDocument();
	});

	it('has proper grid layout structure', () => {
		render(<EngineCard />);

		// Find the grid container (should contain both EngineImage and EngineSpecsTable)
		const engineImage = screen.getByTestId('engine-image');
		const engineSpecsTable = screen.getByTestId('engine-specs-table');

		// Both should be in the same parent grid container
		const gridContainer = engineImage.parentElement;
		expect(gridContainer).toContainElement(engineSpecsTable);
	});

	it('renders all components in correct order', () => {
		const { container } = render(<EngineCard />);

		// Get all elements in order
		const allElements = Array.from(
			container.querySelectorAll('[data-testid]'),
		);
		const elementIds = allElements.map((el) =>
			el.getAttribute('data-testid'),
		);

		// Check that the order is correct
		const selectIndex = elementIds.indexOf('engine-select');
		const imageIndex = elementIds.indexOf('engine-image');
		const specsIndex = elementIds.indexOf('engine-specs-table');

		expect(selectIndex).toBeLessThan(imageIndex);
		expect(selectIndex).toBeLessThan(specsIndex);
		// Image and specs can be in any order within their grid container
	});
});
