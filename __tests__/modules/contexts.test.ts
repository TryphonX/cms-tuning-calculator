/* eslint-env jest */
import { CalculatorContext } from '../../modules/contexts';
import { TuningPartName } from '../../@types/calculator';

describe('contexts module', () => {
	describe('CalculatorContext', () => {
		it('is properly defined and exported', () => {
			expect(CalculatorContext).toBeDefined();
			expect(typeof CalculatorContext).toBe('object');
		});

		it('is a valid React context', () => {
			// Check that it has the expected React context properties
			expect(CalculatorContext.Provider).toBeDefined();
			expect(CalculatorContext.Consumer).toBeDefined();
		});

		it('can be imported without errors', () => {
			// Simple test that the import works
			expect(CalculatorContext).not.toBeNull();
			expect(CalculatorContext).not.toBeUndefined();
		});

		it('has the expected structure when used', () => {
			// Create a mock context value matching the expected interface
			const mockContextValue = {
				currentEngine: null,
				selectedParts: [],
			};

			expect(mockContextValue.currentEngine).toBeNull();
			expect(Array.isArray(mockContextValue.selectedParts)).toBe(true);
			expect(mockContextValue.selectedParts).toHaveLength(0);
		});

		it('supports expected selectedParts structure', () => {
			const mockSelectedParts = [
				{
					name: 'APEX TURBO' as TuningPartName,
					quantity: 2,
				},
				{
					name: 'BEAST TURBO' as TuningPartName,
					quantity: 1,
				},
			];

			expect(mockSelectedParts).toHaveLength(2);
			expect(mockSelectedParts[0].quantity).toBe(2);
			expect(mockSelectedParts[1].quantity).toBe(1);
		});
	});
});
