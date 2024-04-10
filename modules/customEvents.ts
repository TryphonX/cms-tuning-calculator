import { Engine } from '@/@types/calculator';

export const ChangeEngineEvent = {
	name: 'changeEngine',
	dispatch: (newEngine: Engine | null) => {
		dispatchEvent(new CustomEvent(ChangeEngineEvent.name, {
			detail: newEngine,
		}));
	},
};