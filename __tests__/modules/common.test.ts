import {
	getFullPartByName,
	partSortFn,
	ENGINE_CONFIGURATIONS,
} from '../../modules/common';
import { SelectedPart, TuningPartName } from '../../@types/calculator';
import { PartSortBy } from '@/@types/globals';

// Mock the tuning parts data
jest.mock('../../data/tuning-parts.json', () => ({
	'APEX TURBO': {
		name: 'APEX TURBO',
		cost: 1500,
		boost: 85,
		costToBoost: 17.65,
	},
	'BEAST TURBO': {
		name: 'BEAST TURBO',
		cost: 2000,
		boost: 100,
		costToBoost: 20.0,
	},
	'CHEAP EXHAUST': {
		name: 'CHEAP EXHAUST',
		cost: 500,
		boost: 25,
		costToBoost: 20.0,
	},
	'PREMIUM EXHAUST': {
		name: 'PREMIUM EXHAUST',
		cost: 800,
		boost: 35,
		costToBoost: 22.86,
	},
}));

describe('common module', () => {
	describe('getFullPartByName', () => {
		it('retrieves correct part data by name', () => {
			const part = getFullPartByName('APEX TURBO' as TuningPartName);

			expect(part).toEqual({
				name: 'APEX TURBO',
				cost: 1500,
				boost: 85,
				costToBoost: 17.65,
			});
		});

		it('retrieves different part data correctly', () => {
			const part = getFullPartByName('BEAST TURBO' as TuningPartName);

			expect(part).toEqual({
				name: 'BEAST TURBO',
				cost: 2000,
				boost: 100,
				costToBoost: 20.0,
			});
		});
	});

	describe('ENGINE_CONFIGURATIONS', () => {
		it('contains expected engine types', () => {
			expect(ENGINE_CONFIGURATIONS).toEqual([
				'Electric',
				'B6',
				'I3',
				'I4',
				'I5',
				'I6',
				'Rotary',
				'V6',
				'V8',
				'V10',
				'V12',
			]);
		});

		it('has correct number of engine configurations', () => {
			expect(ENGINE_CONFIGURATIONS).toHaveLength(11);
		});

		it('includes specific engine types', () => {
			expect(ENGINE_CONFIGURATIONS).toContain('Electric');
			expect(ENGINE_CONFIGURATIONS).toContain('V8');
			expect(ENGINE_CONFIGURATIONS).toContain('Rotary');
		});
	});

	describe('partSortFn', () => {
		const mockSelectedParts: SelectedPart[] = [
			{ name: 'APEX TURBO' as TuningPartName, quantity: 3 },
			{ name: 'BEAST TURBO' as TuningPartName, quantity: 1 },
			{ name: 'CHEAP EXHAUST' as TuningPartName, quantity: 5 },
		];

		describe('name sorting', () => {
			it('sorts by name ascending correctly', () => {
				const sortFn = partSortFn('name_asc');
				const sorted = [...mockSelectedParts].sort(sortFn);

				expect(sorted.map((p) => p.name)).toEqual([
					'APEX TURBO',
					'BEAST TURBO',
					'CHEAP EXHAUST',
				]);
			});

			it('sorts by name descending correctly', () => {
				const sortFn = partSortFn('name_desc');
				const sorted = [...mockSelectedParts].sort(sortFn);

				expect(sorted.map((p) => p.name)).toEqual([
					'CHEAP EXHAUST',
					'BEAST TURBO',
					'APEX TURBO',
				]);
			});
		});

		describe('quantity sorting', () => {
			it('sorts by quantity ascending correctly', () => {
				const sortFn = partSortFn('quantity_asc');
				const sorted = [...mockSelectedParts].sort(sortFn);

				expect(sorted.map((p) => p.quantity)).toEqual([1, 3, 5]);
			});

			it('sorts by quantity descending correctly', () => {
				const sortFn = partSortFn('quantity_desc');
				const sorted = [...mockSelectedParts].sort(sortFn);

				expect(sorted.map((p) => p.quantity)).toEqual([5, 3, 1]);
			});
		});

		describe('cost sorting', () => {
			it('sorts by cost ascending correctly', () => {
				const sortFn = partSortFn('cost_asc');
				const sorted = [...mockSelectedParts].sort(sortFn);

				expect(sorted.map((p) => p.name)).toEqual([
					'CHEAP EXHAUST',
					'APEX TURBO',
					'BEAST TURBO',
				]);
			});

			it('sorts by cost descending correctly', () => {
				const sortFn = partSortFn('cost_desc');
				const sorted = [...mockSelectedParts].sort(sortFn);

				expect(sorted.map((p) => p.name)).toEqual([
					'BEAST TURBO',
					'APEX TURBO',
					'CHEAP EXHAUST',
				]);
			});
		});

		describe('boost sorting', () => {
			it('sorts by boost ascending correctly', () => {
				const sortFn = partSortFn('boost_asc');
				const sorted = [...mockSelectedParts].sort(sortFn);

				expect(sorted.map((p) => p.name)).toEqual([
					'CHEAP EXHAUST',
					'APEX TURBO',
					'BEAST TURBO',
				]);
			});

			it('sorts by boost descending correctly', () => {
				const sortFn = partSortFn('boost_desc');
				const sorted = [...mockSelectedParts].sort(sortFn);

				expect(sorted.map((p) => p.name)).toEqual([
					'BEAST TURBO',
					'APEX TURBO',
					'CHEAP EXHAUST',
				]);
			});
		});

		describe('cost to boost ratio sorting', () => {
			it('sorts by cost to boost ascending correctly', () => {
				const sortFn = partSortFn('costToBoost_asc');
				const sorted = [...mockSelectedParts].sort(sortFn);
				expect(sorted.map((p) => p.name)).toEqual([
					'APEX TURBO',
					'BEAST TURBO',
					'CHEAP EXHAUST',
				]);
			});

			it('sorts by cost to boost descending correctly', () => {
				const sortFn = partSortFn('costToBoost_desc');
				const sorted = [...mockSelectedParts].sort(sortFn);

				// Expected order: PREMIUM EXHAUST (22.86), CHEAP EXHAUST (20.0), BEAST TURBO (20.0), APEX TURBO (17.65)
				expect(sorted.map((p) => p.name)).toEqual([
					'BEAST TURBO',
					'CHEAP EXHAUST',
					'APEX TURBO',
				]);
			});
		});

		describe('default and edge cases', () => {
			it('defaults to name ascending for unknown sort type', () => {
				const sortFn = partSortFn('unknown_sort' as PartSortBy);
				const sorted = [...mockSelectedParts].sort(sortFn);

				expect(sorted.map((p) => p.name)).toEqual([
					'APEX TURBO',
					'BEAST TURBO',
					'CHEAP EXHAUST',
				]);
			});

			it('handles empty arrays correctly', () => {
				const sortFn = partSortFn('name_asc');
				const sorted = [].sort(sortFn);

				expect(sorted).toEqual([]);
			});

			it('handles single item arrays correctly', () => {
				const sortFn = partSortFn('name_asc');
				const singleItem = [
					{ name: 'APEX TURBO' as TuningPartName, quantity: 1 },
				];
				const sorted = [...singleItem].sort(sortFn);

				expect(sorted).toHaveLength(1);
				expect(sorted[0].name).toBe('APEX TURBO');
			});
		});
	});

	describe('sorting function behavior', () => {
		it('returns consistent comparison results', () => {
			const sortFn = partSortFn('name_asc');
			const partA: SelectedPart = {
				name: 'APEX TURBO' as TuningPartName,
				quantity: 3,
			};
			const partB: SelectedPart = {
				name: 'BEAST TURBO' as TuningPartName,
				quantity: 1,
			};

			// Test that A < B consistently
			expect(sortFn(partA, partB)).toBeLessThan(0);
			expect(sortFn(partB, partA)).toBeGreaterThan(0);
			expect(sortFn(partA, partA)).toBe(0);
		});

		it('returns correct function types for different sort options', () => {
			const nameSortFn = partSortFn('name_asc');
			const quantitySortFn = partSortFn('quantity_asc');
			const costSortFn = partSortFn('cost_asc');

			expect(typeof nameSortFn).toBe('function');
			expect(typeof quantitySortFn).toBe('function');
			expect(typeof costSortFn).toBe('function');
		});
	});
});
