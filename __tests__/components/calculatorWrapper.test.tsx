/* eslint-env jest */
import { render, screen, act } from '@testing-library/react';
import { useContext } from 'react';
import CalculatorWrapper from '@/components/calculatorWrapper/calculatorWrapper';
import { CalculatorContext } from '@/modules/contexts';
import {
	ChangeEngineEvent,
	ToggleSelectedPartEvent,
	UpdateSelectedPartsEvent,
} from '@/modules/customEvents';
import { Engine, SelectedPart } from '@/@types/calculator';

// Test component to access context values
const TestComponent = () => {
	const { currentEngine, selectedParts } = useContext(CalculatorContext);
	return (
		<div>
			<div data-testid="current-engine">
				{currentEngine ? currentEngine.name : 'No engine'}
			</div>
			<div data-testid="selected-parts-count">{selectedParts.length}</div>
			<div data-testid="selected-parts">
				{selectedParts.map((part) => part.name).join(', ')}
			</div>
		</div>
	);
};

const mockEngine: Engine = {
	name: 'CHRG-eE1',
	imgUrl: 'test-image.jpg',
	specs: {
		power: '246',
		torque: '194',
		gearbox: 'Gearbox (CHRG-eE1)',
		configuration: 'Electric',
	},
	compatibleParts: [],
};

const mockPart: SelectedPart = {
	name: 'Air Filter',
	quantity: 1,
};

const mockPart2: SelectedPart = {
	name: 'Air Filter (B6 M64.01)',
	quantity: 1,
};

describe('CalculatorWrapper', () => {
	beforeEach(() => {
		// Clear any existing event listeners
		jest.clearAllMocks();
	});

	it('renders children correctly', () => {
		render(
			<CalculatorWrapper>
				<div data-testid="child">Test Child</div>
			</CalculatorWrapper>,
		);

		expect(screen.getByTestId('child')).toBeInTheDocument();
		expect(screen.getByText('Test Child')).toBeInTheDocument();
	});

	it('provides initial context values', () => {
		render(
			<CalculatorWrapper>
				<TestComponent />
			</CalculatorWrapper>,
		);

		expect(screen.getByTestId('current-engine')).toHaveTextContent(
			'No engine',
		);
		expect(screen.getByTestId('selected-parts-count')).toHaveTextContent(
			'0',
		);
		expect(screen.getByTestId('selected-parts')).toHaveTextContent('');
	});

	it('updates current engine when ChangeEngineEvent is dispatched', () => {
		render(
			<CalculatorWrapper>
				<TestComponent />
			</CalculatorWrapper>,
		);

		act(() => {
			ChangeEngineEvent.dispatch(mockEngine);
		});

		expect(screen.getByTestId('current-engine')).toHaveTextContent(
			'CHRG-eE1',
		);
	});

	it('clears selected parts when engine changes', () => {
		render(
			<CalculatorWrapper>
				<TestComponent />
			</CalculatorWrapper>,
		);

		// First add a part
		act(() => {
			ToggleSelectedPartEvent.dispatch(mockPart, true);
		});

		expect(screen.getByTestId('selected-parts-count')).toHaveTextContent(
			'1',
		);

		// Then change engine
		act(() => {
			ChangeEngineEvent.dispatch(mockEngine);
		});

		expect(screen.getByTestId('selected-parts-count')).toHaveTextContent(
			'0',
		);
	});

	it('sets current engine to null when ChangeEngineEvent dispatches null', () => {
		render(
			<CalculatorWrapper>
				<TestComponent />
			</CalculatorWrapper>,
		);

		// First set an engine
		act(() => {
			ChangeEngineEvent.dispatch(mockEngine);
		});

		expect(screen.getByTestId('current-engine')).toHaveTextContent(
			'CHRG-eE1',
		);

		// Then set to null
		act(() => {
			ChangeEngineEvent.dispatch(null);
		});

		expect(screen.getByTestId('current-engine')).toHaveTextContent(
			'No engine',
		);
	});

	it('adds part when ToggleSelectedPartEvent is dispatched with toggleOn true', () => {
		render(
			<CalculatorWrapper>
				<TestComponent />
			</CalculatorWrapper>,
		);

		act(() => {
			ToggleSelectedPartEvent.dispatch(mockPart, true);
		});

		expect(screen.getByTestId('selected-parts-count')).toHaveTextContent(
			'1',
		);
		expect(screen.getByTestId('selected-parts')).toHaveTextContent(
			'Air Filter',
		);
	});

	it('removes part when ToggleSelectedPartEvent is dispatched with toggleOn false', () => {
		render(
			<CalculatorWrapper>
				<TestComponent />
			</CalculatorWrapper>,
		);

		// First add the part
		act(() => {
			ToggleSelectedPartEvent.dispatch(mockPart, true);
		});

		expect(screen.getByTestId('selected-parts-count')).toHaveTextContent(
			'1',
		);

		// Then remove it
		act(() => {
			ToggleSelectedPartEvent.dispatch(mockPart, false);
		});

		expect(screen.getByTestId('selected-parts-count')).toHaveTextContent(
			'0',
		);
		expect(screen.getByTestId('selected-parts')).toHaveTextContent('');
	});

	it('handles multiple parts being added and removed', () => {
		render(
			<CalculatorWrapper>
				<TestComponent />
			</CalculatorWrapper>,
		);

		// Add first part
		act(() => {
			ToggleSelectedPartEvent.dispatch(mockPart, true);
		});

		// Add second part
		act(() => {
			ToggleSelectedPartEvent.dispatch(mockPart2, true);
		});

		expect(screen.getByTestId('selected-parts-count')).toHaveTextContent(
			'2',
		);
		expect(screen.getByTestId('selected-parts')).toHaveTextContent(
			'Air Filter, Air Filter (B6 M64.01)',
		);

		// Remove first part
		act(() => {
			ToggleSelectedPartEvent.dispatch(mockPart, false);
		});

		expect(screen.getByTestId('selected-parts-count')).toHaveTextContent(
			'1',
		);
		expect(screen.getByTestId('selected-parts')).toHaveTextContent(
			'Air Filter (B6 M64.01)',
		);
	});

	it('updates selected parts when UpdateSelectedPartsEvent is dispatched', () => {
		render(
			<CalculatorWrapper>
				<TestComponent />
			</CalculatorWrapper>,
		);

		const newParts = [mockPart, mockPart2];

		act(() => {
			UpdateSelectedPartsEvent.dispatch(newParts);
		});

		expect(screen.getByTestId('selected-parts-count')).toHaveTextContent(
			'2',
		);
		expect(screen.getByTestId('selected-parts')).toHaveTextContent(
			'Air Filter, Air Filter (B6 M64.01)',
		);
	});

	it('replaces existing parts when UpdateSelectedPartsEvent is dispatched', () => {
		render(
			<CalculatorWrapper>
				<TestComponent />
			</CalculatorWrapper>,
		);

		// First add a part via toggle
		act(() => {
			ToggleSelectedPartEvent.dispatch(mockPart, true);
		});

		expect(screen.getByTestId('selected-parts-count')).toHaveTextContent(
			'1',
		);

		// Then update with a different set
		act(() => {
			UpdateSelectedPartsEvent.dispatch([mockPart2]);
		});

		expect(screen.getByTestId('selected-parts-count')).toHaveTextContent(
			'1',
		);
		expect(screen.getByTestId('selected-parts')).toHaveTextContent(
			'Air Filter (B6 M64.01)',
		);
	});

	it('handles UpdateSelectedPartsEvent with empty array', () => {
		render(
			<CalculatorWrapper>
				<TestComponent />
			</CalculatorWrapper>,
		);

		// First add some parts
		act(() => {
			ToggleSelectedPartEvent.dispatch(mockPart, true);
		});

		expect(screen.getByTestId('selected-parts-count')).toHaveTextContent(
			'1',
		);

		// Then clear with empty array
		act(() => {
			UpdateSelectedPartsEvent.dispatch([]);
		});

		expect(screen.getByTestId('selected-parts-count')).toHaveTextContent(
			'0',
		);
		expect(screen.getByTestId('selected-parts')).toHaveTextContent('');
	});

	it('provides context to nested components', () => {
		const NestedComponent = () => {
			const { currentEngine, selectedParts } =
				useContext(CalculatorContext);
			return (
				<div>
					<div data-testid="nested-engine">
						{currentEngine ? 'Has Engine' : 'No Engine'}
					</div>
					<div data-testid="nested-parts">
						{selectedParts.length} parts
					</div>
				</div>
			);
		};

		render(
			<CalculatorWrapper>
				<div>
					<TestComponent />
					<NestedComponent />
				</div>
			</CalculatorWrapper>,
		);

		act(() => {
			ChangeEngineEvent.dispatch(mockEngine);
			ToggleSelectedPartEvent.dispatch(mockPart, true);
		});

		expect(screen.getByTestId('nested-engine')).toHaveTextContent(
			'Has Engine',
		);
		expect(screen.getByTestId('nested-parts')).toHaveTextContent('1 parts');
	});
});
