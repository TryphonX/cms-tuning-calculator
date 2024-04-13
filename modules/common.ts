import { CompatiblePart, TuningPartName } from '@/@types/calculator';
import tuningParts from '@/data/tuning-parts.json';

export const getTunedPartByName = (partName: TuningPartName) => tuningParts[partName];

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

const compareNamesAsc = (a: CompatiblePart, b: CompatiblePart) => {
	if (a.name < b.name) {
		return -1;
	}
	if (a.name > b.name) {
		return 1;
	}
	return 0;
};

const compareNamesDesc = (a: CompatiblePart, b: CompatiblePart) => {
	if (a.name < b.name) {
		return 1;
	}
	if (a.name > b.name) {
		return -1;
	}
	return 0;
};

const compareQtAsc = (a: CompatiblePart, b: CompatiblePart) => {

	if (a.quantity < b.quantity) {
		return -1;
	}
	if (a.quantity > b.quantity) {
		return 1;
	}
	return 0;
};

const compareQtDesc = (a: CompatiblePart, b: CompatiblePart) => {
	if (a.quantity < b.quantity) {
		return 1;
	}
	if (a.quantity > b.quantity) {
		return -1;
	}
	return 0;
};

const compareCostAsc = (a: CompatiblePart, b: CompatiblePart) => {

	const [partA, partB] = [getTunedPartByName(a.name), getTunedPartByName(b.name)];

	if (partA?.cost < partB?.cost) {
		return -1;
	}
	if (partA?.cost > partB?.cost) {
		return 1;
	}
	return 0;
};

const compareCostDesc = (a: CompatiblePart, b: CompatiblePart) => {

	const [partA, partB] = [getTunedPartByName(a.name), getTunedPartByName(b.name)];

	if (partA?.cost < partB?.cost) {
		return 1;
	}
	if (partA?.cost > partB?.cost) {
		return -1;
	}
	return 0;
};

const compareBoostAsc = (a: CompatiblePart, b: CompatiblePart) => {

	const [partA, partB] = [getTunedPartByName(a.name), getTunedPartByName(b.name)];

	if (partA?.boost < partB?.boost) {
		return -1;
	}
	if (partA?.boost > partB?.boost) {
		return 1;
	}
	return 0;
};

const compareBoostDesc = (a: CompatiblePart, b: CompatiblePart) => {
	compareBoostDesc;
	const [partA, partB] = [getTunedPartByName(a.name), getTunedPartByName(b.name)];

	if (partA?.boost < partB?.boost) {
		return 1;
	}
	if (partA?.boost > partB?.boost) {
		return -1;
	}
	return 0;
};

const compareCostToBoostAsc = (a: CompatiblePart, b: CompatiblePart) => {

	const [partA, partB] = [getTunedPartByName(a.name), getTunedPartByName(b.name)];

	if (partA?.costToBoost < partB?.costToBoost) {
		return -1;
	}
	if (partA?.costToBoost > partB?.costToBoost) {
		return 1;
	}
	return 0;
};

const compareCostToBoostDesc = (a: CompatiblePart, b: CompatiblePart) => {

	const [partA, partB] = [getTunedPartByName(a.name), getTunedPartByName(b.name)];

	if (partA?.costToBoost < partB?.costToBoost) {
		return 1;
	}
	if (partA?.costToBoost > partB?.costToBoost) {
		return -1;
	}
	return 0;
};