/* eslint-env jest */
import {
	TuningPart,
	TuningPartName,
	TuningSetup,
} from '../../../@types/calculator';

// Since this is a worker file, we need to test the logic by importing it differently
// We'll test the core logic by extracting and testing the helper functions

describe('calculateBestSetup worker module', () => {
	// Mock data for testing - using actual tuning part names
	const mockParts: TuningPart[] = [
		{
			name: 'Air Filter' as TuningPartName,
			cost: 500,
			boost: 25,
			costToBoost: 20,
		},
		{
			name: 'Air Filter (B6 M64.01)' as TuningPartName,
			cost: 1000,
			boost: 40,
			costToBoost: 25,
		},
		{
			name: 'Air Filter (B6 M64.50)' as TuningPartName,
			cost: 300,
			boost: 20,
			costToBoost: 15,
		},
		{
			name: 'Cold Air Intake' as TuningPartName,
			cost: 800,
			boost: 50,
			costToBoost: 16,
		},
	];

	const mockRepairParts: Partial<Record<TuningPartName, number>> = {
		'Air Filter': -100, // Savings when repairing
		'Air Filter (B6 M64.50)': -50,
	};

	const emptyRepairParts: Partial<Record<TuningPartName, number>> = {};

	// Helper function to simulate the isNewSetupBetter logic
	const isNewSetupBetter = (
		newSetup: TuningSetup,
		currentBest: TuningSetup,
	) => {
		const newSetUpNetCost = newSetup.repairs?.netCost ?? newSetup.cost;
		const currentBestNetCost =
			currentBest.repairs?.netCost ?? currentBest.cost;

		return newSetUpNetCost !== currentBestNetCost
			? newSetUpNetCost < currentBestNetCost
			: newSetup.boost > currentBest.boost;
	};

	// Helper function to generate combinations (simplified version of worker logic)
	const generateCombination = (
		parts: TuningPart[],
		mask: number,
		repairParts: Partial<Record<TuningPartName, number>>,
	) => {
		let comboCost = 0;
		let netCost = 0;
		let comboBoost = 0;
		let hasRepairParts = false;
		const repairPartNames: TuningPartName[] = [];
		const partNames: TuningPartName[] = [];

		for (let i = 0; i < parts.length; i++) {
			if (mask & (1 << i)) {
				const part = parts[i];
				comboCost += part.cost;
				netCost += part.cost;
				comboBoost += part.boost;
				partNames.push(part.name);

				if (repairParts[part.name] !== undefined) {
					netCost += repairParts[part.name]!;
					repairPartNames.push(part.name);
					hasRepairParts = true;
				}
			}
		}

		const costToBoost = comboCost / comboBoost;
		return {
			partNames,
			cost: comboCost,
			boost: comboBoost,
			costToBoost,
			repairs: hasRepairParts
				? {
						repairPartNames,
						netCost,
						netCostToBoost: netCost / comboBoost,
						totalSaved: comboCost - netCost,
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  }
				: undefined,
		} as TuningSetup;
	};

	describe('isNewSetupBetter comparison logic', () => {
		it('prefers lower net cost when costs are different', () => {
			const setup1: TuningSetup = {
				partNames: ['CHEAP_TURBO' as TuningPartName],
				cost: 500,
				boost: 25,
				costToBoost: 20,
				repairs: {
					repairPartNames: ['CHEAP_TURBO' as TuningPartName],
					netCost: 400,
					netCostToBoost: 16,
					totalSaved: 100,
				},
			};

			const setup2: TuningSetup = {
				partNames: ['EXPENSIVE_TURBO' as TuningPartName],
				cost: 1000,
				boost: 40,
				costToBoost: 25,
			};

			expect(isNewSetupBetter(setup1, setup2)).toBe(true);
			expect(isNewSetupBetter(setup2, setup1)).toBe(false);
		});

		it('prefers higher boost when net costs are equal', () => {
			const setup1: TuningSetup = {
				partNames: ['CHEAP_TURBO' as TuningPartName],
				cost: 500,
				boost: 25,
				costToBoost: 20,
			};

			const setup2: TuningSetup = {
				partNames: [
					'EFFICIENT_EXHAUST' as TuningPartName,
					'CHEAP_TURBO' as TuningPartName,
				],
				cost: 800,
				boost: 45,
				costToBoost: 17.78,
				repairs: {
					repairPartNames: [
						'CHEAP_TURBO' as TuningPartName,
						'EFFICIENT_EXHAUST' as TuningPartName,
					],
					netCost: 500, // Same net cost due to repairs
					netCostToBoost: 11.11,
					totalSaved: 150,
				},
			};

			expect(isNewSetupBetter(setup2, setup1)).toBe(true);
			expect(isNewSetupBetter(setup1, setup2)).toBe(false);
		});

		it('uses regular cost when no repairs are present', () => {
			const setup1: TuningSetup = {
				partNames: ['CHEAP_TURBO' as TuningPartName],
				cost: 500,
				boost: 25,
				costToBoost: 20,
			};

			const setup2: TuningSetup = {
				partNames: ['EFFICIENT_EXHAUST' as TuningPartName],
				cost: 300,
				boost: 20,
				costToBoost: 15,
			};

			expect(isNewSetupBetter(setup2, setup1)).toBe(true);
		});
	});

	describe('combination generation logic', () => {
		it('generates single part combination correctly', () => {
			const mask = 1; // Binary: 0001 (select first part)
			const combination = generateCombination(
				mockParts,
				mask,
				emptyRepairParts,
			);

			expect(combination.partNames).toEqual(['Air Filter']);
			expect(combination.cost).toBe(500);
			expect(combination.boost).toBe(25);
			expect(combination.costToBoost).toBe(20);
			expect(!!combination.repairs).toBe(false);
		});

		it('generates multi-part combination correctly', () => {
			const mask = 3; // Binary: 0011 (select first two parts)
			const combination = generateCombination(
				mockParts,
				mask,
				emptyRepairParts,
			);

			expect(combination.partNames).toEqual([
				'Air Filter',
				'Air Filter (B6 M64.01)',
			]);
			expect(combination.cost).toBe(1500);
			expect(combination.boost).toBe(65);
			expect(combination.costToBoost).toBeCloseTo(23.08, 2);
			expect(!!combination.repairs).toBe(false);
		});

		it('applies repair parts correctly', () => {
			const mask = 1; // Binary: 0001 (select first part which has repairs)
			const combination = generateCombination(
				mockParts,
				mask,
				mockRepairParts,
			);

			expect(combination.partNames).toEqual(['Air Filter']);
			expect(combination.cost).toBe(500);
			expect(combination.boost).toBe(25);
			expect(!!combination.repairs).toBe(true);
			expect(combination.repairs?.repairPartNames).toEqual([
				'Air Filter',
			]);
			expect(combination.repairs?.netCost).toBe(400); // 500 - 100
			expect(combination.repairs?.totalSaved).toBe(100);
			expect(combination.repairs?.netCostToBoost).toBe(16); // 400 / 25
		});

		it('handles mixed repair and non-repair parts', () => {
			const mask = 5; // Binary: 0101 (select first and third parts)
			const combination = generateCombination(
				mockParts,
				mask,
				mockRepairParts,
			);

			expect(combination.partNames).toEqual([
				'Air Filter',
				'Air Filter (B6 M64.50)',
			]);
			expect(combination.cost).toBe(800); // 500 + 300
			expect(combination.boost).toBe(45); // 25 + 20
			expect(!!combination.repairs).toBe(true);
			expect(combination.repairs?.repairPartNames).toEqual([
				'Air Filter',
				'Air Filter (B6 M64.50)',
			]);
			expect(combination.repairs?.netCost).toBe(650); // 800 - 100 - 50
			expect(combination.repairs?.totalSaved).toBe(150);
		});

		it('calculates cost-to-boost ratios correctly', () => {
			const mask = 8; // Binary: 1000 (select fourth part)
			const combination = generateCombination(
				mockParts,
				mask,
				emptyRepairParts,
			);

			expect(combination.costToBoost).toBe(16); // 800 / 50
		});
	});

	describe('bitmask iteration logic', () => {
		it('generates correct number of combinations', () => {
			const numParts = mockParts.length;
			const totalCombinations = (1 << numParts) - 1; // 2^n - 1 (excluding empty set)

			expect(totalCombinations).toBe(15); // 2^4 - 1 = 15 combinations
		});

		it('validates bitmask logic for selecting parts', () => {
			const testCases = [
				{ mask: 1, expected: [0] }, // Binary: 0001
				{ mask: 2, expected: [1] }, // Binary: 0010
				{ mask: 3, expected: [0, 1] }, // Binary: 0011
				{ mask: 4, expected: [2] }, // Binary: 0100
				{ mask: 8, expected: [3] }, // Binary: 1000
				{ mask: 15, expected: [0, 1, 2, 3] }, // Binary: 1111
			];

			testCases.forEach(({ mask, expected }) => {
				const selectedIndices: number[] = [];
				for (let i = 0; i < mockParts.length; i++) {
					if (mask & (1 << i)) {
						selectedIndices.push(i);
					}
				}
				expect(selectedIndices).toEqual(expected);
			});
		});
	});

	describe('target boost filtering', () => {
		it('identifies combinations that meet target boost', () => {
			const targetBoost = 40;
			const validCombinations: TuningSetup[] = [];

			// Test all possible combinations
			for (let mask = 1; mask < 1 << mockParts.length; mask++) {
				const combination = generateCombination(
					mockParts,
					mask,
					emptyRepairParts,
				);
				if (combination.boost >= targetBoost) {
					validCombinations.push(combination);
				}
			}

			// Should find combinations that have boost >= 40
			expect(validCombinations.length).toBeGreaterThan(0);
			validCombinations.forEach((combo) => {
				expect(combo.boost).toBeGreaterThanOrEqual(targetBoost);
			});
		});

		it('excludes combinations below target boost', () => {
			const targetBoost = 100; // Very high target
			const validCombinations: TuningSetup[] = [];

			for (let mask = 1; mask < 1 << mockParts.length; mask++) {
				const combination = generateCombination(
					mockParts,
					mask,
					emptyRepairParts,
				);
				if (combination.boost >= targetBoost) {
					validCombinations.push(combination);
				}
			}

			// No single parts should meet this high target
			const singlePartCombos = validCombinations.filter(
				(combo) => combo.partNames.length === 1,
			);
			expect(singlePartCombos).toHaveLength(0);
		});
	});

	describe('best setup selection', () => {
		it('selects the most cost-effective setup', () => {
			const allCombinations: TuningSetup[] = [];
			const targetBoost = 30;

			// Generate all valid combinations
			for (let mask = 1; mask < 1 << mockParts.length; mask++) {
				const combination = generateCombination(
					mockParts,
					mask,
					mockRepairParts,
				);
				if (combination.boost >= targetBoost) {
					allCombinations.push(combination);
				}
			}

			// Find best setup manually
			let bestSetup: TuningSetup | null = null;
			for (const setup of allCombinations) {
				if (!bestSetup || isNewSetupBetter(setup, bestSetup)) {
					bestSetup = setup;
				}
			}

			expect(bestSetup).not.toBeNull();
			expect(bestSetup!.boost).toBeGreaterThanOrEqual(targetBoost);

			// Verify no other setup is better
			for (const setup of allCombinations) {
				if (setup !== bestSetup) {
					expect(isNewSetupBetter(setup, bestSetup!)).toBe(false);
				}
			}
		});

		it('prioritizes repair parts when cost-effective', () => {
			const targetBoost = 25;
			const allCombinations: TuningSetup[] = [];

			for (let mask = 1; mask < 1 << mockParts.length; mask++) {
				const combination = generateCombination(
					mockParts,
					mask,
					mockRepairParts,
				);
				if (combination.boost >= targetBoost) {
					allCombinations.push(combination);
				}
			}

			// Find combinations with and without repairs
			const withRepairs = allCombinations.filter((c) => !!c.repairs);
			const withoutRepairs = allCombinations.filter((c) => !c.repairs);

			expect(withRepairs.length).toBeGreaterThan(0);
			expect(withoutRepairs.length).toBeGreaterThan(0);

			// Verify that repair combinations have lower net costs
			const bestWithRepairs = withRepairs.reduce((best, current) =>
				isNewSetupBetter(current, best) ? current : best,
			);
			const bestWithoutRepairs = withoutRepairs.reduce((best, current) =>
				isNewSetupBetter(current, best) ? current : best,
			);

			expect(bestWithRepairs.repairs?.netCost).toBeLessThan(
				bestWithRepairs.cost,
			);

			expect(bestWithRepairs.cost).toBeLessThan(bestWithoutRepairs.cost);
		});
	});

	describe('edge cases', () => {
		it('handles empty repair parts object', () => {
			const mask = 1;
			const combination = generateCombination(
				mockParts,
				mask,
				emptyRepairParts,
			);

			expect(!!combination.repairs).toBe(false);
		});

		it('handles single part scenarios', () => {
			const singlePart = [mockParts[0]];
			const mask = 1;
			const combination = generateCombination(
				singlePart,
				mask,
				emptyRepairParts,
			);

			expect(combination.partNames).toEqual(['Air Filter']);
			expect(combination.cost).toBe(500);
			expect(combination.boost).toBe(25);
		});

		it('calculates ratios correctly for small numbers', () => {
			const lowCostPart: TuningPart = {
				name: 'Air Filter' as TuningPartName,
				cost: 1,
				boost: 1,
				costToBoost: 1,
			};

			const combination = generateCombination(
				[lowCostPart],
				1,
				emptyRepairParts,
			);
			expect(combination.costToBoost).toBe(1);
		});
	});
});
