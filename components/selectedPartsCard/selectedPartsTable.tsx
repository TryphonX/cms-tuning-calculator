'use client';

import { CalculatorContext } from '@/modules/contexts';
import { useContext, useEffect, useState } from 'react';
import { UpdateSortEvent } from '@/modules/customEvents';
import { PartSortBy, getCompareFn, getFullPartByName } from '@/modules/common';
import { SortBy } from '@/@types/globals';
import SortBtn from '../sortBtn/sortBtn';

export default function SelectedPartsTable() {
	const { currentEngine, selectedParts } = useContext(CalculatorContext);

	const [sortBy, setSortBy] = useState(PartSortBy.NameAsc);

	// onMount
	useEffect(() => {
		const handleUpdateSort = (e: Event) => {
			e.stopPropagation();
			setSortBy((e as CustomEvent<SortBy>).detail ?? PartSortBy.NameAsc);
		};

		window.addEventListener(UpdateSortEvent.name, handleUpdateSort);

		return () => {
			window.removeEventListener(UpdateSortEvent.name, handleUpdateSort);
		};
	}, []);

	if (!currentEngine) return;

	const sortedSelectedParts = selectedParts.sort(getCompareFn(sortBy));

	const totalBoost = selectedParts.reduce(
		(sum, current) =>
			sum + getFullPartByName(current.name)?.boost * current.quantity,
		0,
	);

	const totalCost = selectedParts.reduce(
		(sum, current) =>
			sum + getFullPartByName(current.name)?.cost * current.quantity,
		0,
	);

	const totalCostToBoost = totalBoost > 0 ? totalCost / totalBoost : 0;

	return (
		<>
			<div className='overflow-x-auto w-full rounded-2xl border border-secondary'>
				<table className='table table-md table-zebra'>
					<thead className='text-sm'>
						<tr>
							<th className='w-1/3'>
								Name{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.NameAsc,
										PartSortBy.NameDesc,
									]}
								/>
							</th>
							<th>
								Qt{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.QuantityAsc,
										PartSortBy.QuantityDesc,
									]}
								/>
							</th>
							<th className='text-right'>
								Boost{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.BoostAsc,
										PartSortBy.BoostDesc,
									]}
								/>
							</th>
							<th className='text-right'>
								Cost{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.CostAsc,
										PartSortBy.CostDesc,
									]}
								/>
							</th>
							<th className='text-right'>
								Cost / Boost{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.CostToBoostAsc,
										PartSortBy.CostToBoostDesc,
									]}
								/>
							</th>
						</tr>
					</thead>
					<tbody>
						{sortedSelectedParts.map((part) => {
							const tuningPartData = getFullPartByName(part.name);

							if (!tuningPartData) {
								console.warn(`Part missing: ${part.name}`);
							}

							return (
								<tr key={`${part.name.replace(' ', '-')}-row`}>
									<td>{part.name}</td>
									<td>{part.quantity}</td>
									<td className='text-right'>
										+{tuningPartData?.boost ?? '-'}%
									</td>
									<td className='text-right'>
										{tuningPartData?.cost ?? '-'} CR
									</td>
									<td className='text-right'>
										{(
											tuningPartData?.cost /
											tuningPartData?.boost
										).toFixed(2) || '-'}{' '}
										CR/Boost
									</td>
								</tr>
							);
						})}
					</tbody>
					<tfoot className='text-sm'>
						<tr className='bg-secondary text-secondary-content'>
							<th colSpan={2}>Total:</th>
							<th className='text-right'>
								+{totalBoost.toFixed(2) ?? '-'}%
							</th>
							<th className='text-right'>
								{totalCost ?? '-'} CR
							</th>
							<th className='text-right'>
								{totalCostToBoost.toFixed(2) || '-'} CR/Boost
							</th>
						</tr>
					</tfoot>
				</table>
			</div>
		</>
	);
}
