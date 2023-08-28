export class ClearSelectedPartsEvent extends CustomEvent {

	static eventName = 'clearselectedparts';

	constructor() {
		super(ClearSelectedPartsEvent.eventName);
	}
}

export class UpdateSelectedPartsEvent extends CustomEvent {

	static eventName = 'updateselectedparts';

	constructor(newVal) {
		super(UpdateSelectedPartsEvent.eventName, { detail: newVal });
	}
}