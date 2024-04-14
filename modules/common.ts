import {
	CompatiblePart,
	SelectedPart,
	TuningPart,
	TuningPartBase,
	TuningPartName,
	TuningSetup,
} from '@/@types/calculator';
import tuningParts from '@/data/tuning-parts.json';
import combinations from 'combinations';

export const getFullPartByName = (partName: TuningPartName) =>
	tuningParts[partName];

export enum PartSortBy {
	NameAsc = 'name_asc',
	NameDesc = 'name_desc',
	QuantityAsc = 'quantity_asc',
	QuantityDesc = 'quantity_desc',
	CostAsc = 'cost_asc',
	CostDesc = 'cost_desc',
	BoostAsc = 'boost_asc',
	BoostDesc = 'boost_desc',
	CostToBoostAsc = 'costToBoost_asc',
	CostToBoostDesc = 'costToBoost_desc',
}

export const getCompareFn = (sortBy: PartSortBy) => {
	switch (sortBy) {
		case PartSortBy.NameAsc:
			return compareNamesAsc;

		case PartSortBy.NameDesc:
			return compareNamesDesc;

		case PartSortBy.QuantityAsc:
			return compareQtAsc;

		case PartSortBy.QuantityDesc:
			return compareQtDesc;

		case PartSortBy.CostAsc:
			return compareCostAsc;

		case PartSortBy.CostDesc:
			return compareCostDesc;

		case PartSortBy.BoostAsc:
			return compareBoostAsc;

		case PartSortBy.BoostDesc:
			return compareBoostDesc;

		case PartSortBy.CostToBoostAsc:
			return compareCostToBoostAsc;

		case PartSortBy.CostToBoostDesc:
			return compareCostToBoostDesc;

		default:
			return compareNamesAsc;
	}
};

const compareNamesAsc = (a: TuningPartBase, b: TuningPartBase) => {
	if (a.name < b.name) {
		return -1;
	}
	if (a.name > b.name) {
		return 1;
	}
	return 0;
};

const compareNamesDesc = (a: TuningPartBase, b: TuningPartBase) => {
	if (a.name < b.name) {
		return 1;
	}
	if (a.name > b.name) {
		return -1;
	}
	return 0;
};

const compareQtAsc = (
	a: SelectedPart | CompatiblePart,
	b: SelectedPart | CompatiblePart,
) => {
	if (a.quantity < b.quantity) {
		return -1;
	}
	if (a.quantity > b.quantity) {
		return 1;
	}
	return 0;
};

const compareQtDesc = (
	a: SelectedPart | CompatiblePart,
	b: SelectedPart | CompatiblePart,
) => {
	if (a.quantity < b.quantity) {
		return 1;
	}
	if (a.quantity > b.quantity) {
		return -1;
	}
	return 0;
};

const compareCostAsc = (a: TuningPartBase, b: TuningPartBase) => {
	const [partA, partB] = [
		getFullPartByName(a.name),
		getFullPartByName(b.name),
	];

	if (partA?.cost < partB?.cost) {
		return -1;
	}
	if (partA?.cost > partB?.cost) {
		return 1;
	}
	return 0;
};

const compareCostDesc = (a: TuningPartBase, b: TuningPartBase) => {
	const [partA, partB] = [
		getFullPartByName(a.name),
		getFullPartByName(b.name),
	];

	if (partA?.cost < partB?.cost) {
		return 1;
	}
	if (partA?.cost > partB?.cost) {
		return -1;
	}
	return 0;
};

const compareBoostAsc = (a: TuningPartBase, b: TuningPartBase) => {
	const [partA, partB] = [
		getFullPartByName(a.name),
		getFullPartByName(b.name),
	];

	if (partA?.boost < partB?.boost) {
		return -1;
	}
	if (partA?.boost > partB?.boost) {
		return 1;
	}
	return 0;
};

const compareBoostDesc = (a: TuningPartBase, b: TuningPartBase) => {
	compareBoostDesc;
	const [partA, partB] = [
		getFullPartByName(a.name),
		getFullPartByName(b.name),
	];

	if (partA?.boost < partB?.boost) {
		return 1;
	}
	if (partA?.boost > partB?.boost) {
		return -1;
	}
	return 0;
};

const compareCostToBoostAsc = (a: TuningPartBase, b: TuningPartBase) => {
	const [partA, partB] = [
		getFullPartByName(a.name),
		getFullPartByName(b.name),
	];

	if (partA?.costToBoost < partB?.costToBoost) {
		return -1;
	}
	if (partA?.costToBoost > partB?.costToBoost) {
		return 1;
	}
	return 0;
};

const compareCostToBoostDesc = (a: TuningPartBase, b: TuningPartBase) => {
	const [partA, partB] = [
		getFullPartByName(a.name),
		getFullPartByName(b.name),
	];

	if (partA?.costToBoost < partB?.costToBoost) {
		return 1;
	}
	if (partA?.costToBoost > partB?.costToBoost) {
		return -1;
	}
	return 0;
};

const compareSetups = (a: TuningSetup, b: TuningSetup) => {
	if (a.cost > b.cost) {
		return 1;
	}

	if (a.cost < b.cost) {
		return -1;
	}

	return a.boost < b.boost ? 1 : -1;
};

export const calculateBestSetup = (
	parts: TuningPart[],
	targetBoostIncrease: number,
) => {
	const allCombos = combinations<TuningPart>(parts);

	const allEligibleSetups: TuningSetup[] = allCombos
		.map<TuningSetup>((combo) => ({
			partNames: combo.map((part) => part.name),
			cost: combo.reduce((acc, curr) => acc + curr.cost, 0),
			boost: combo.reduce((acc, curr) => acc + curr.boost, 0),
			costToBoost:
				combo.reduce((acc, curr) => acc + curr.cost, 0) /
				combo.reduce((acc, curr) => acc + curr.boost, 0),
		}))
		.filter((setup) => setup.boost >= targetBoostIncrease);

	if (!allEligibleSetups.length) return null;

	allEligibleSetups.sort(compareSetups);

	return allEligibleSetups[0];
};
