import {
	CompatiblePart,
	SelectedPart,
	TuningPartBase,
	TuningPartName,
} from '@/@types/calculator';
import { PartSortBy } from '@/@types/globals';
import tuningParts from '@/data/tuning-parts.json';

export const getFullPartByName = (partName: TuningPartName) =>
	tuningParts[partName];

export const getCompareFn = (sortBy: PartSortBy) => {
	switch (sortBy) {
		case 'name_asc':
			return compareNamesAsc;

		case 'name_desc':
			return compareNamesDesc;

		case 'quantity_asc':
			return compareQtAsc;

		case 'quantity_desc':
			return compareQtDesc;

		case 'cost_asc':
			return compareCostAsc;

		case 'cost_desc':
			return compareCostDesc;

		case 'boost_asc':
			return compareBoostAsc;

		case 'boost_desc':
			return compareBoostDesc;

		case 'costToBoost_asc':
			return compareCostToBoostAsc;

		case 'costToBoost_desc':
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

export const ENGINE_CONFIGURATIONS = [
	'Electric',
	'B6',
	'I3',
	'I4',
	'I5',
	'I6',
	'Rotary',
	'V6',
	'V8',
	'V10',
	'V12',
];
