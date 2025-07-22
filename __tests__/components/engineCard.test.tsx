/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import EngineCard from '@/components/EngineCard';

// Mock child components
jest.mock('@/components/Card', () => {
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

jest.mock('@/components/EngineCard/EngineImage', () => {
	const MockEngineImage = () => <div data-testid="engine-image" />;
	MockEngineImage.displayName = 'MockEngineImage';
	return MockEngineImage;
});

jest.mock('@/components/EngineCard/EngineSelect', () => {
	const MockEngineSelect = ({ className }: { className?: string }) => (
		<div data-testid="engine-select" className={className} />
	);
	MockEngineSelect.displayName = 'MockEngineSelect';
	return MockEngineSelect;
});

jest.mock('@/components/EngineCard/EngineSpecsTable', () => {
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
