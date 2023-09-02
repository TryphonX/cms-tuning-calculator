// Type Definitions:

/**
 * @typedef {object} CompatiblePart
 * @prop {string} name The name of the part
 * @prop {number} quantity The number of times this type of part is fitted on each engine
 * @prop {number} cost The part's price (in CR)
 */

/**
 * @typedef {object} EngineSpecs
 * @prop {number} power The engine's peak power (in HP)
 * @prop {number} torque The engine's peak torque (in N-m)
 * @prop {string} gearbox The name of the compatible gearbox
 */

/**
 * @typedef {object} Engine
 * @prop {string} name The name of the engine
 * @prop {string} imgUrl The url of the engine's image
 * @prop {EngineSpecs} specs The engine's specifications
 * @prop {CompatiblePart[]} compatibleParts The parts that are compatible with the engine
 */

/**
 * @typedef {object} SelectedPart
 * @prop {string} name The name of the part
 * @prop {number} quantity The number of times this type of part is fitted on each engine
 */

/**
 * @typedef {object} TuningPart
 * @prop {string} name The name of the part
 * @prop {number} cost The part's price (in CR)
 * @prop {number} boost The part's boost increase
 * @prop {number} costToBoost The part's cost to boost ratio - CR / Boost
 */

/**
 * @typedef {Function} CompareFunction
 * @param {React.ChangeEvent} event
 * @returns {number}
 */