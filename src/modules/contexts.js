import { createContext } from 'react';

export const CalculatorContext = createContext({
	currentEngine: null,
	setCurrentEngine: () => console.log('setCurrentEngine'),
	selectedParts: [{ name: 'engine part', quantity: 0 }],
});