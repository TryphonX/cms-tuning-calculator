import { createContext } from 'react';
import { Engine, SelectedPart, TuningSetup } from '../@types/calculator';

export const CalculatorContext = createContext({
	currentEngine: null as Engine | null,
	selectedParts: [] as SelectedPart[],
	locked: false,
	repairs: undefined as TuningSetup['repairs'],
});
