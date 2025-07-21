import { render, screen } from '@testing-library/react';
import EngineImage from '@/components/EngineCard/EngineImage';
import { CalculatorContext } from '@/modules/contexts';
import { Engine, EngineName } from '@/@types/calculator';

// Mock Next.js Image component
jest.mock('next/image', () => {
	return function MockImage({
		src,
		alt,
		width,
		height,
		className,
	}: {
		src: string;
		alt: string;
		width: number;
		height: number;
		className?: string;
	}) {
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				src={src}
				alt={alt}
				width={width}
				height={height}
				className={className}
				data-testid="engine-image"
			/>
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

const defaultContextValue = {
	currentEngine: mockEngine,
	selectedParts: [],
};

const renderWithContext = (contextValue = defaultContextValue) => {
	return render(
		<CalculatorContext.Provider value={contextValue}>
			<EngineImage />
		</CalculatorContext.Provider>,
	);
};

describe('EngineImage', () => {
	it('renders engine image when currentEngine is set', () => {
		renderWithContext();

		const image = screen.getByTestId('engine-image');
		expect(image).toBeInTheDocument();
		expect(image).toHaveAttribute('src', '/test-engine.jpg');
		expect(image).toHaveAttribute('alt', 'CHRG-eE1');
		expect(image).toHaveAttribute('width', '200');
		expect(image).toHaveAttribute('height', '188');
	});

	it('does not render when no currentEngine is set', () => {
		renderWithContext({
			currentEngine: null as unknown as Engine,
			selectedParts: [],
		});

		expect(screen.queryByTestId('engine-image')).not.toBeInTheDocument();
	});

	it('updates image when engine changes', () => {
		const { rerender } = renderWithContext();

		// Verify initial image
		const initialImage = screen.getByTestId('engine-image');
		expect(initialImage).toHaveAttribute('src', '/test-engine.jpg');
		expect(initialImage).toHaveAttribute('alt', 'CHRG-eE1');

		// Change engine
		const newEngine: Engine = {
			...mockEngine,
			name: 'eDen-1H' as EngineName,
			imgUrl: '/different-engine.jpg',
		};

		rerender(
			<CalculatorContext.Provider
				value={{
					currentEngine: newEngine,
					selectedParts: [],
				}}
			>
				<EngineImage />
			</CalculatorContext.Provider>,
		);

		// Verify updated image
		const updatedImage = screen.getByTestId('engine-image');
		expect(updatedImage).toHaveAttribute('src', '/different-engine.jpg');
		expect(updatedImage).toHaveAttribute('alt', 'eDen-1H');
	});

	it('handles undefined currentEngine gracefully', () => {
		renderWithContext({
			currentEngine: undefined as unknown as Engine,
			selectedParts: [],
		});

		expect(screen.queryByTestId('engine-image')).not.toBeInTheDocument();
	});

	it('uses engine name in alt text', () => {
		const engineWithLongName: Engine = {
			...mockEngine,
			name: 'Very Long Engine Name' as EngineName,
		};

		renderWithContext({
			currentEngine: engineWithLongName,
			selectedParts: [],
		});

		const image = screen.getByTestId('engine-image');
		expect(image).toHaveAttribute('alt', 'Very Long Engine Name');
	});
});
