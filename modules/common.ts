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

export const partSortFn = (sortBy: PartSortBy) => {
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

const compareNamesAsc = (a: TuningPartBase, b: TuningPartBase) =>
	a.name < b.name ? -1 : 1;

const compareNamesDesc = (a: TuningPartBase, b: TuningPartBase) =>
	a.name > b.name ? -1 : 1;

const compareQtAsc = (
	a: SelectedPart | CompatiblePart,
	b: SelectedPart | CompatiblePart,
) => a.quantity - b.quantity;

const compareQtDesc = (
	a: SelectedPart | CompatiblePart,
	b: SelectedPart | CompatiblePart,
) => b.quantity - a.quantity;

const compareCostAsc = (a: TuningPartBase, b: TuningPartBase) => {
	const [partA, partB] = [
		getFullPartByName(a.name),
		getFullPartByName(b.name),
	];

	return partA?.cost - partB?.cost;
};

const compareCostDesc = (a: TuningPartBase, b: TuningPartBase) => {
	const [partA, partB] = [
		getFullPartByName(a.name),
		getFullPartByName(b.name),
	];

	return partB?.cost - partA?.cost;
};

const compareBoostAsc = (a: TuningPartBase, b: TuningPartBase) => {
	const [partA, partB] = [
		getFullPartByName(a.name),
		getFullPartByName(b.name),
	];

	return partA?.boost - partB?.boost;
};

const compareBoostDesc = (a: TuningPartBase, b: TuningPartBase) => {
	const [partA, partB] = [
		getFullPartByName(a.name),
		getFullPartByName(b.name),
	];

	return partB?.boost - partA?.boost;
};

const compareCostToBoostAsc = (a: TuningPartBase, b: TuningPartBase) => {
	const [partA, partB] = [
		getFullPartByName(a.name),
		getFullPartByName(b.name),
	];

	return partA?.costToBoost - partB?.costToBoost;
};

const compareCostToBoostDesc = (a: TuningPartBase, b: TuningPartBase) => {
	const [partA, partB] = [
		getFullPartByName(a.name),
		getFullPartByName(b.name),
	];

	return partB?.costToBoost - partA?.costToBoost;
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
