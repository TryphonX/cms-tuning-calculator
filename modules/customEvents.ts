import { Engine, SelectedPart, TuningSetup } from '@/@types/calculator';
import { PartSortBy } from '@/@types/globals';

export const ChangeEngineEvent = {
	name: 'changeEngine',
	dispatch: (newEngine: Engine | null) => {
		dispatchEvent(
			new CustomEvent(ChangeEngineEvent.name, {
				detail: newEngine,
			}),
		);
	},
};

export const UpdateSelectedPartsEvent = {
	name: 'updateSelectedParts',
	dispatch: (parts: SelectedPart[]) => {
		dispatchEvent(
			new CustomEvent(UpdateSelectedPartsEvent.name, {
				detail: parts,
			}),
		);
	},
};

export type ToggleSelectedPartEventInit = {
	part: SelectedPart;
	toggleOn: boolean;
};

export const ToggleSelectedPartEvent = {
	name: 'toggleSelectedParts',
	dispatch: (part: SelectedPart, toggleOn: boolean) => {
		const detail: ToggleSelectedPartEventInit = {
			part,
			toggleOn,
		};

		dispatchEvent(
			new CustomEvent(ToggleSelectedPartEvent.name, {
				detail,
			}),
		);
	},
};

export const UpdateSortEvent = {
	name: 'updateSortEvent',
	dispatch: (newSort: PartSortBy) => {
		dispatchEvent(
			new CustomEvent(UpdateSortEvent.name, {
				detail: newSort,
			}),
		);
	},
};

export const UnlockEvent = {
	name: 'setUnlockEvent',
	dispatch: () => {
		dispatchEvent(new CustomEvent(UnlockEvent.name));
	},
};

export const SetRepairsEvent = {
	name: 'setRepairsEvent',
	dispatch: (repairs: TuningSetup['repairs']) => {
		dispatchEvent(
			new CustomEvent(SetRepairsEvent.name, {
				detail: repairs,
			}),
		);
	},
};
