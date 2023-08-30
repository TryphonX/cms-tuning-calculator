/** @module customEvents */
import './types.jsdoc';

/**
 * @class
 * @extends {CustomEvent}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * A [CustomEvent]{@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent} for clearing the [selectedParts]{@link module:contexts.CalculatorContext}.
 */
export class ClearSelectedPartsEvent extends CustomEvent {

	static eventName = 'clearselectedparts';

	constructor() {
		super(ClearSelectedPartsEvent.eventName);
	}
}

/**
 * A [CustomEvent]{@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent} for updating the [selectedParts]{@link module:contexts.CalculatorContext}.
 * 
 * @class
 * @extends {CustomEvent}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 */
export class UpdateSelectedPartsEvent extends CustomEvent {

	static eventName = 'updateselectedparts';

	/**
	 * @constructor
	 * @param {SelectedPart[]} newVal The new value to replace the previous [selectedParts]{@link module:contexts.CalculatorContext}
	 */
	constructor(newVal) {
		super(UpdateSelectedPartsEvent.eventName, { detail: newVal });
	}
}

/**
 * A [CustomEvent]{@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent} for updating the [currentEngine]{@link module:contexts.CalculatorContext}.
 * 
 * @class
 * @extends {CustomEvent}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 */
export class UpdateEngineEvent extends CustomEvent {

	static eventName = 'updateengine';

	/**
	 * @constructor
	 * @param {Nullable<Engine>} newVal The new value to replace the previous [currentEngine]{@link module:contexts.CalculatorContext}
	 */
	constructor(newVal) {
		super(UpdateEngineEvent.eventName, { detail: newVal });
	}
}