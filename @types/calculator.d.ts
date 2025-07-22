import engines from '@/data/engines.json';
import tuningParts from '@/data/tuning-parts.json';

export declare interface CompatiblePart extends TuningPartBase {
	/**
	 * The number of times this type of part is fitted on each engine
	 */
	quantity: number;
	/**
	 * The part's price (in CR)
	 */
	cost: number;
	/**
	 * Whether the part is missing
	 */
	missing?: boolean;
}

export declare interface EngineSpecs {
	/**
	 * The engine's peak power (in HP)
	 */
	power: string;
	/**
	 * The engine's peak torque (in N-m)
	 */
	torque: string;
	/**
	 * The name of the compatible gearbox
	 */
	gearbox: string;
	/**
	 * The configuration of the engine (eg V8)
	 */
	configuration: string;
}

export type EngineName = keyof typeof engines;

export declare interface Engine {
	/**
	 * The name of the engine
	 */
	name: EngineName;
	/**
	 * The url of the engine's image
	 */
	imgUrl: string;
	/**
	 * The engine's specifications
	 */
	specs: EngineSpecs;
	/**
	 * The parts that are compatible with the engine
	 */
	compatibleParts: CompatiblePart[];
}

export declare interface TuningPartBase {
	/**
	 * The name of the part
	 */
	name: TuningPartName;
}

export declare interface SelectedPart extends TuningPartBase {
	/**
	 * The number of times this type of part is fitted on each engine
	 */
	quantity: number;
}

export type TuningPartName = keyof typeof tuningParts;

export declare interface TuningPart extends TuningPartBase {
	/**
	 * The part's price (in CR)
	 */
	cost: number;
	/**
	 * The part's boost increase
	 */
	boost: number;
	/**
	 * The part's cost to boost ratio - CR / Boost
	 */
	costToBoost: number;
}

export declare interface TuningSetup {
	partNames: TuningPartName[];
	cost: number;
	boost: number;
	costToBoost: number;
	repairs?: {
		repairPartNames: TuningPartName[];
		/** The cost of the tuning minus the repairs */
		netCost: number;
		netCostToBoost: number;
		totalSaved: number;
	};
}

/**
 * key: TuningPartName
 * value: The cost of the repair part x(-1)
 */
export type RepairParts = Record<Partial<TuningPartName>, number>;
