import { Engine, SelectedPart } from '@/@types/calculator';

export const ChangeEngineEvent = {
	name: 'changeEngine',
	dispatch: (newEngine: Engine | null) => {
		dispatchEvent(new CustomEvent(ChangeEngineEvent.name, {
			detail: newEngine,
		}));
	},
};

export const UpdateSelectedPartsEvent = {
	name: 'updateSelectedParts',
	dispatch: (parts: SelectedPart[]) => {
		dispatchEvent(new CustomEvent(UpdateSelectedPartsEvent.name, {
			detail: parts,
		}));
	},
};

export type ToggleSelectedPartEventInit = {
	part: SelectedPart
	toggleOn: boolean
}

export const ToggleSelectedPartEvent = {
	name: 'toggleSelectedParts',
	dispatch: (part: SelectedPart, toggleOn: boolean) => {
		const detail: ToggleSelectedPartEventInit = {
			part,
			toggleOn,
		};

		dispatchEvent(new CustomEvent(ToggleSelectedPartEvent.name, {
			detail,
		}));
	},
};