import { render, screen, waitFor } from '@testing-library/react';
import CalculatorWrapper from '@/components/calculatorWrapper/calculatorWrapper';
import { CalculatorContext } from '@/modules/contexts';
import {
	ChangeEngineEvent,
	ToggleSelectedPartEvent,
	UpdateSelectedPartsEvent,
} from '@/modules/customEvents';
import {
	Engine,
	EngineName,
	TuningPartName,
	SelectedPart,
} from '@/@types/calculator';
import { useContext } from 'react';

// Test component to access the context
function TestConsumer() {
	const { currentEngine, selectedParts } = useContext(CalculatorContext);

	return (
		<div>
			<div data-testid="current-engine">
				{currentEngine ? currentEngine.name : 'No Engine'}
			</div>
			<div data-testid="selected-parts">
				{selectedParts.map((part) => (
					<span key={part.name} data-testid={`selected-${part.name}`}>
						{part.name}: {part.quantity}
					</span>
				))}
			</div>
		</div>
	);
}

const mockEngine: Engine = {
	name: 'CHRG-eE1' as EngineName,
	imgUrl: '/test-engine.jpg',
	compatibleParts: [
		{ name: 'Air Filter' as TuningPartName, quantity: 2, cost: 35 },
		{ name: 'Carburetor' as TuningPartName, quantity: 1, cost: 320 },
	],
	specs: {
		power: '246',
		torque: '194',
		gearbox: 'Gearbox (CHRG-eE1)',
		configuration: 'Electric',
	},
};

const secondEngine: Engine = {
	name: 'Different Engine' as EngineName,
	imgUrl: '/different-engine.jpg',
	compatibleParts: [
		{ name: 'Turbocharger' as TuningPartName, quantity: 1, cost: 450 },
	],
	specs: {
		power: '300',
		torque: '250',
		gearbox: 'Gearbox (Different)',
		configuration: 'V8',
	},
};

describe('CalculatorWrapper Integration Tests', () => {
	beforeEach(() => {
		// Clear any existing custom event listeners
		document.body.innerHTML = '';
	});

	afterEach(() => {
		// Clean up any remaining event listeners
		document.body.innerHTML = '';
	});

	it('provides initial empty context values', () => {
		render(
			<CalculatorWrapper>
				<TestConsumer />
			</CalculatorWrapper>,
		);

		expect(screen.getByTestId('current-engine')).toHaveTextContent(
			'No Engine',
		);
		expect(screen.getByTestId('selected-parts')).toBeEmptyDOMElement();
	});

	it('updates context when ChangeEngineEvent is dispatched', async () => {
		render(
			<CalculatorWrapper>
				<TestConsumer />
			</CalculatorWrapper>,
		);

		// Dispatch change engine event
		ChangeEngineEvent.dispatch(mockEngine);

		await waitFor(() => {
			expect(screen.getByTestId('current-engine')).toHaveTextContent(
				'CHRG-eE1',
			);
		});
	});

	it('clears selected parts when engine changes', async () => {
		render(
			<CalculatorWrapper>
				<TestConsumer />
			</CalculatorWrapper>,
		);

		// First, set an engine and add some parts
		ChangeEngineEvent.dispatch(mockEngine);

		await waitFor(() => {
			expect(screen.getByTestId('current-engine')).toHaveTextContent(
				'CHRG-eE1',
			);
		});

		// Add a part
		ToggleSelectedPartEvent.dispatch(
			{ name: 'Air Filter' as TuningPartName, quantity: 2 },
			true,
		);

		await waitFor(() => {
			expect(screen.getByTestId('selected-Air Filter')).toHaveTextContent(
				'Air Filter: 2',
			);
		});

		// Change to a different engine
		ChangeEngineEvent.dispatch(secondEngine);

		await waitFor(() => {
			expect(screen.getByTestId('current-engine')).toHaveTextContent(
				'Different Engine',
			);
			expect(screen.getByTestId('selected-parts')).toBeEmptyDOMElement();
		});
	});

	it('handles ToggleSelectedPartEvent for adding parts', async () => {
		render(
			<CalculatorWrapper>
				<TestConsumer />
			</CalculatorWrapper>,
		);

		// Set an engine first
		ChangeEngineEvent.dispatch(mockEngine);

		await waitFor(() => {
			expect(screen.getByTestId('current-engine')).toHaveTextContent(
				'CHRG-eE1',
			);
		});

		// Add a part
		ToggleSelectedPartEvent.dispatch(
			{ name: 'Air Filter' as TuningPartName, quantity: 2 },
			true,
		);

		await waitFor(() => {
			expect(screen.getByTestId('selected-Air Filter')).toHaveTextContent(
				'Air Filter: 2',
			);
		});

		// Add another part
		ToggleSelectedPartEvent.dispatch(
			{ name: 'Carburetor' as TuningPartName, quantity: 1 },
			true,
		);

		await waitFor(() => {
			expect(screen.getByTestId('selected-Carburetor')).toHaveTextContent(
				'Carburetor: 1',
			);
		});
	});

	it('handles ToggleSelectedPartEvent for removing parts', async () => {
		render(
			<CalculatorWrapper>
				<TestConsumer />
			</CalculatorWrapper>,
		);

		// Set an engine first
		ChangeEngineEvent.dispatch(mockEngine);

		// Add parts
		ToggleSelectedPartEvent.dispatch(
			{ name: 'Air Filter' as TuningPartName, quantity: 2 },
			true,
		);
		ToggleSelectedPartEvent.dispatch(
			{ name: 'Carburetor' as TuningPartName, quantity: 1 },
			true,
		);

		await waitFor(() => {
			expect(screen.getByTestId('selected-Air Filter')).toHaveTextContent(
				'Air Filter: 2',
			);
			expect(screen.getByTestId('selected-Carburetor')).toHaveTextContent(
				'Carburetor: 1',
			);
		});

		// Remove one part
		ToggleSelectedPartEvent.dispatch(
			{ name: 'Air Filter' as TuningPartName, quantity: 2 },
			false,
		);

		await waitFor(() => {
			expect(
				screen.queryByTestId('selected-Air Filter'),
			).not.toBeInTheDocument();
			expect(screen.getByTestId('selected-Carburetor')).toHaveTextContent(
				'Carburetor: 1',
			);
		});
	});

	it('handles UpdateSelectedPartsEvent', async () => {
		render(
			<CalculatorWrapper>
				<TestConsumer />
			</CalculatorWrapper>,
		);

		// Set an engine first
		ChangeEngineEvent.dispatch(mockEngine);

		const newSelectedParts: SelectedPart[] = [
			{ name: 'Air Filter' as TuningPartName, quantity: 2 },
			{ name: 'Carburetor' as TuningPartName, quantity: 1 },
		];

		// Update with multiple parts at once
		UpdateSelectedPartsEvent.dispatch(newSelectedParts);

		await waitFor(() => {
			expect(screen.getByTestId('selected-Air Filter')).toHaveTextContent(
				'Air Filter: 2',
			);
			expect(screen.getByTestId('selected-Carburetor')).toHaveTextContent(
				'Carburetor: 1',
			);
		});

		// Clear all parts
		UpdateSelectedPartsEvent.dispatch([]);

		await waitFor(() => {
			expect(screen.getByTestId('selected-parts')).toBeEmptyDOMElement();
		});
	});

	it('handles setting engine to null', async () => {
		render(
			<CalculatorWrapper>
				<TestConsumer />
			</CalculatorWrapper>,
		);

		// Set an engine first
		ChangeEngineEvent.dispatch(mockEngine);

		await waitFor(() => {
			expect(screen.getByTestId('current-engine')).toHaveTextContent(
				'CHRG-eE1',
			);
		});

		// Set engine to null
		ChangeEngineEvent.dispatch(null);

		await waitFor(() => {
			expect(screen.getByTestId('current-engine')).toHaveTextContent(
				'No Engine',
			);
		});
	});

	it('removes duplicate parts when toggling on', async () => {
		render(
			<CalculatorWrapper>
				<TestConsumer />
			</CalculatorWrapper>,
		);

		// Set an engine first
		ChangeEngineEvent.dispatch(mockEngine);

		// Add a part
		ToggleSelectedPartEvent.dispatch(
			{ name: 'Air Filter' as TuningPartName, quantity: 2 },
			true,
		);

		await waitFor(() => {
			expect(screen.getByTestId('selected-Air Filter')).toHaveTextContent(
				'Air Filter: 2',
			);
		});

		// Try to add the same part again (should replace, not duplicate)
		ToggleSelectedPartEvent.dispatch(
			{ name: 'Air Filter' as TuningPartName, quantity: 1 },
			true,
		);

		await waitFor(() => {
			// Should still only have one Air Filter entry
			const airFilterElements = screen.getAllByTestId(
				'selected-Air Filter',
			);
			expect(airFilterElements).toHaveLength(1);
			expect(airFilterElements[0]).toHaveTextContent('Air Filter: 1');
		});
	});

	it('ignores ToggleSelectedPartEvent when trying to remove non-existent part', async () => {
		render(
			<CalculatorWrapper>
				<TestConsumer />
			</CalculatorWrapper>,
		);

		// Set an engine first
		ChangeEngineEvent.dispatch(mockEngine);

		// Try to remove a part that doesn't exist
		ToggleSelectedPartEvent.dispatch(
			{ name: 'Air Filter' as TuningPartName, quantity: 2 },
			false,
		);

		// Should still have empty selected parts
		expect(screen.getByTestId('selected-parts')).toBeEmptyDOMElement();
	});

	it('cleans up event listeners on unmount', () => {
		const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
		const removeEventListenerSpy = jest.spyOn(
			window,
			'removeEventListener',
		);

		const { unmount } = render(
			<CalculatorWrapper>
				<TestConsumer />
			</CalculatorWrapper>,
		);

		// Should have added event listeners
		expect(addEventListenerSpy).toHaveBeenCalledWith(
			ChangeEngineEvent.name,
			expect.any(Function),
		);
		expect(addEventListenerSpy).toHaveBeenCalledWith(
			ToggleSelectedPartEvent.name,
			expect.any(Function),
		);
		expect(addEventListenerSpy).toHaveBeenCalledWith(
			UpdateSelectedPartsEvent.name,
			expect.any(Function),
		);

		unmount();

		// Should have removed event listeners
		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			ChangeEngineEvent.name,
			expect.any(Function),
		);
		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			ToggleSelectedPartEvent.name,
			expect.any(Function),
		);
		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			UpdateSelectedPartsEvent.name,
			expect.any(Function),
		);

		addEventListenerSpy.mockRestore();
		removeEventListenerSpy.mockRestore();
	});
});
