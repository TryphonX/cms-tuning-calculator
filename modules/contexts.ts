import { createContext } from 'react';
import { Engine, SelectedPart } from '../@types/calculator';

export const CalculatorContext = createContext({
	currentEngine: null as Engine | null,
	selectedParts: [] as SelectedPart[],
});
