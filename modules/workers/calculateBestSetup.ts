import { TuningPart, TuningPartName, TuningSetup } from '@/@types/calculator';

const isNewSetupBetter = (newSetup: TuningSetup, currentBest: TuningSetup) =>
	newSetup.cost !== currentBest.cost
		? newSetup.cost < currentBest.cost
		: newSetup.boost > currentBest.boost;

onmessage = function (
	e: MessageEvent<{
		parts: TuningPart[];
		targetBoostIncrease: number;
	}>,
) {
	const parts = e.data.parts;
	const targetBoostIncrease = e.data.targetBoostIncrease;

	const numParts = parts.length;
	let bestSetup: TuningSetup | null = null;

	// iterate over each possible combination via a bitmask
	for (let mask = 1; mask < 1 << numParts; mask++) {
		let comboCost = 0;
		let comboBoost = 0;
		const partNames: TuningPartName[] = [];

		// generate combination for current mask
		for (let i = 0; i < numParts; i++) {
			if (mask & (1 << i)) {
				// check i-th bit of the mask
				const part = parts[i];
				comboCost += part.cost;
				comboBoost += part.boost;
				partNames.push(part.name);
			}
		}

		// ignore combinations that don't meet the target
		if (comboBoost >= targetBoostIncrease) {
			const costToBoost = comboCost / comboBoost;
			const setup: TuningSetup = {
				partNames: partNames,
				cost: comboCost,
				boost: comboBoost,
				costToBoost: costToBoost,
			};

			// update bestSetup
			if (!bestSetup || isNewSetupBetter(setup, bestSetup)) {
				bestSetup = setup;
			}
		}
	}

	postMessage(bestSetup);
};
