import engines from '@/data/engines.json';
import tuningParts from '@/data/tuning-parts.json';

export declare interface CompatiblePart {
	/**
	 * The name of the part
	 */
	name: string
	/**
	 * The number of times this type of part is fitted on each engine
	 */
	quantity: number
	/**
	 * The part's price (in CR)
	 */
	cost: number
}

export declare interface EngineSpecs {
	/**
	 * The engine's peak power (in HP)
	 */
	power: number
	/**
	 * The engine's peak torque (in N-m)
	 */
	torque: number
	/**
	 * The name of the compatible gearbox
	 */
	gearbox: string
}

export type EngineName = keyof typeof engines;

export declare interface Engine {
	/**
	 * The name of the engine
	 */
	name: string
	/**
	 * The url of the engine's image
	 */
	imgUrl: string
	/**
	 * The engine's specifications
	 */
	specs: EngineSpecs
	/**
	 * The parts that are compatible with the engine
	 */
	compatibleParts: CompatiblePart[]
}

export declare interface SelectedPart {
	/**
	 * The name of the part
	 */
	name: string
	/**
	 * The number of times this type of part is fitted on each engine
	 */
	quantity: number
}

export type TuningPartName = keyof typeof tuningParts;

export declare interface TuningPart {
	/**
	 * The name of the part
	 */
	name: string
	/**
	 * The part's price (in CR)
	 */
	cost: number
	/**
	 * The part's boost increase
	 */
	boost: number
	/**
	 * The part's cost to boost ratio - CR / Boost
	 */
	costToBoost: number
}

export declare interface TuningSetup {
	partNames: string[]
	cost: number
	boost: number
	costToBoost: number
}