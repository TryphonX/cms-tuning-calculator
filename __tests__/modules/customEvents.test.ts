/* eslint-env jest */
import {
	ChangeEngineEvent,
	UpdateSelectedPartsEvent,
	ToggleSelectedPartEvent,
	UpdateSortEvent,
	ToggleSelectedPartEventInit,
} from '../../modules/customEvents';
import { Engine, SelectedPart, TuningPartName } from '../../@types/calculator';
import { PartSortBy } from '../../@types/globals';

// Mock the global dispatchEvent function
const mockDispatchEvent = jest.fn();
global.dispatchEvent = mockDispatchEvent;

describe('customEvents module', () => {
	beforeEach(() => {
		mockDispatchEvent.mockClear();
	});

	describe('ChangeEngineEvent', () => {
		it('has correct event name', () => {
			expect(ChangeEngineEvent.name).toBe('changeEngine');
		});

		it('dispatches custom event with engine data', () => {
			const mockEngine = {
				name: 'B6 M64.01',
				config: 'V8',
				boost: 100,
			} as unknown as Engine;

			ChangeEngineEvent.dispatch(mockEngine);

			expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
			const dispatchedEvent = mockDispatchEvent.mock.calls[0][0];

			expect(dispatchedEvent).toBeInstanceOf(CustomEvent);
			expect(dispatchedEvent.type).toBe('changeEngine');
			expect(dispatchedEvent.detail).toEqual(mockEngine);
		});

		it('dispatches custom event with null engine', () => {
			ChangeEngineEvent.dispatch(null);

			expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
			const dispatchedEvent = mockDispatchEvent.mock.calls[0][0];

			expect(dispatchedEvent).toBeInstanceOf(CustomEvent);
			expect(dispatchedEvent.type).toBe('changeEngine');
			expect(dispatchedEvent.detail).toBeNull();
		});
	});

	describe('UpdateSelectedPartsEvent', () => {
		it('has correct event name', () => {
			expect(UpdateSelectedPartsEvent.name).toBe('updateSelectedParts');
		});

		it('dispatches custom event with parts array', () => {
			const mockParts: SelectedPart[] = [
				{
					name: 'APEX TURBO' as TuningPartName,
					quantity: 2,
				},
				{
					name: 'BEAST TURBO' as TuningPartName,
					quantity: 1,
				},
			];

			UpdateSelectedPartsEvent.dispatch(mockParts);

			expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
			const dispatchedEvent = mockDispatchEvent.mock.calls[0][0];

			expect(dispatchedEvent).toBeInstanceOf(CustomEvent);
			expect(dispatchedEvent.type).toBe('updateSelectedParts');
			expect(dispatchedEvent.detail).toEqual(mockParts);
			expect(dispatchedEvent.detail).toHaveLength(2);
		});

		it('dispatches custom event with empty parts array', () => {
			const emptyParts: SelectedPart[] = [];

			UpdateSelectedPartsEvent.dispatch(emptyParts);

			expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
			const dispatchedEvent = mockDispatchEvent.mock.calls[0][0];

			expect(dispatchedEvent.detail).toEqual([]);
			expect(dispatchedEvent.detail).toHaveLength(0);
		});
	});

	describe('ToggleSelectedPartEvent', () => {
		it('has correct event name', () => {
			expect(ToggleSelectedPartEvent.name).toBe('toggleSelectedParts');
		});

		it('dispatches custom event with toggle on', () => {
			const mockPart: SelectedPart = {
				name: 'APEX TURBO' as TuningPartName,
				quantity: 1,
			};

			ToggleSelectedPartEvent.dispatch(mockPart, true);

			expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
			const dispatchedEvent = mockDispatchEvent.mock.calls[0][0];

			expect(dispatchedEvent).toBeInstanceOf(CustomEvent);
			expect(dispatchedEvent.type).toBe('toggleSelectedParts');

			const detail: ToggleSelectedPartEventInit = dispatchedEvent.detail;
			expect(detail.part).toEqual(mockPart);
			expect(detail.toggleOn).toBe(true);
		});

		it('dispatches custom event with toggle off', () => {
			const mockPart: SelectedPart = {
				name: 'BEAST TURBO' as TuningPartName,
				quantity: 3,
			};

			ToggleSelectedPartEvent.dispatch(mockPart, false);

			expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
			const dispatchedEvent = mockDispatchEvent.mock.calls[0][0];

			const detail: ToggleSelectedPartEventInit = dispatchedEvent.detail;
			expect(detail.part).toEqual(mockPart);
			expect(detail.toggleOn).toBe(false);
		});

		it('properly structures ToggleSelectedPartEventInit', () => {
			const mockPart: SelectedPart = {
				name: 'CHEAP EXHAUST' as TuningPartName,
				quantity: 5,
			};

			ToggleSelectedPartEvent.dispatch(mockPart, true);

			const detail = mockDispatchEvent.mock.calls[0][0].detail;

			// Check that detail has the correct structure
			expect(Object.keys(detail)).toEqual(['part', 'toggleOn']);
			expect(detail).toHaveProperty('part');
			expect(detail).toHaveProperty('toggleOn');
			expect(typeof detail.toggleOn).toBe('boolean');
			expect(typeof detail.part).toBe('object');
		});
	});

	describe('UpdateSortEvent', () => {
		it('has correct event name', () => {
			expect(UpdateSortEvent.name).toBe('updateSortEvent');
		});

		it('dispatches custom event with sort option', () => {
			const sortOption: PartSortBy = 'name_asc';

			UpdateSortEvent.dispatch(sortOption);

			expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
			const dispatchedEvent = mockDispatchEvent.mock.calls[0][0];

			expect(dispatchedEvent).toBeInstanceOf(CustomEvent);
			expect(dispatchedEvent.type).toBe('updateSortEvent');
			expect(dispatchedEvent.detail).toBe(sortOption);
		});

		it('dispatches custom event with different sort options', () => {
			const sortOptions: PartSortBy[] = [
				'name_desc',
				'cost_asc',
				'cost_desc',
				'boost_asc',
				'boost_desc',
				'quantity_asc',
				'quantity_desc',
				'costToBoost_asc',
				'costToBoost_desc',
			];

			sortOptions.forEach((sortOption, index) => {
				UpdateSortEvent.dispatch(sortOption);

				const dispatchedEvent = mockDispatchEvent.mock.calls[index][0];
				expect(dispatchedEvent.detail).toBe(sortOption);
			});

			expect(mockDispatchEvent).toHaveBeenCalledTimes(sortOptions.length);
		});
	});

	describe('Event integration tests', () => {
		it('all events can be dispatched in sequence', () => {
			const mockEngine = { name: 'I4 204PT' } as unknown as Engine;
			const mockParts: SelectedPart[] = [
				{ name: 'APEX TURBO' as TuningPartName, quantity: 1 },
			];
			const mockPart: SelectedPart = {
				name: 'BEAST TURBO' as TuningPartName,
				quantity: 2,
			};
			const sortOption: PartSortBy = 'name_asc';

			ChangeEngineEvent.dispatch(mockEngine);
			UpdateSelectedPartsEvent.dispatch(mockParts);
			ToggleSelectedPartEvent.dispatch(mockPart, true);
			UpdateSortEvent.dispatch(sortOption);

			expect(mockDispatchEvent).toHaveBeenCalledTimes(4);

			// Verify event types in order
			expect(mockDispatchEvent.mock.calls[0][0].type).toBe(
				'changeEngine',
			);
			expect(mockDispatchEvent.mock.calls[1][0].type).toBe(
				'updateSelectedParts',
			);
			expect(mockDispatchEvent.mock.calls[2][0].type).toBe(
				'toggleSelectedParts',
			);
			expect(mockDispatchEvent.mock.calls[3][0].type).toBe(
				'updateSortEvent',
			);
		});

		it('events maintain proper data types', () => {
			const mockPart: SelectedPart = {
				name: 'PREMIUM EXHAUST' as TuningPartName,
				quantity: 42,
			};

			ToggleSelectedPartEvent.dispatch(mockPart, false);

			const event = mockDispatchEvent.mock.calls[0][0];
			const detail = event.detail;

			expect(typeof detail.part.quantity).toBe('number');
			expect(typeof detail.part.name).toBe('string');
			expect(typeof detail.toggleOn).toBe('boolean');
			expect(detail.part.quantity).toBe(42);
			expect(detail.toggleOn).toBe(false);
		});

		it('CustomEvent constructor receives correct parameters', () => {
			const mockPart: SelectedPart = {
				name: 'APEX TURBO' as TuningPartName,
				quantity: 1,
			};

			ToggleSelectedPartEvent.dispatch(mockPart, true);

			const event = mockDispatchEvent.mock.calls[0][0];

			// Verify CustomEvent structure
			expect(event.type).toBe('toggleSelectedParts');
			expect(event.bubbles).toBe(false); // Default CustomEvent behavior
			expect(event.cancelable).toBe(false); // Default CustomEvent behavior
			expect(event.detail).toBeDefined();
		});
	});
});
