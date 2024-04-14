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
			<div className='overflow-x-auto w-full rounded-2xl border border-base-200'>
				<table className='table table-xs sm:table-sm xl:table-sm 2xl:table-sm table-zebra'>
					<thead className='text-sm'>
						<tr>
							<th className='w-1/2 xl:w-1/3 2xl:w-1/2'>
								Part{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.NameAsc,
										PartSortBy.NameDesc,
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
							<th className='text-right max-md:hidden'>
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
									<td>
										x{part.quantity} {part.name}
									</td>
									<td className='text-right'>
										+
										{(
											tuningPartData?.boost *
											part.quantity
										).toFixed(2) ?? '-'}
										%
									</td>
									<td className='text-right'>
										{tuningPartData?.cost * part.quantity ??
											'-'}{' '}
										CR
									</td>
									<td
										className='text-right max-md:hidden'
										title={(
											tuningPartData?.cost /
											tuningPartData?.boost
										).toString()}
									>
										{(
											tuningPartData?.cost /
											tuningPartData?.boost
										).toFixed(0) || '-'}{' '}
										CR/Boost
									</td>
								</tr>
							);
						})}
					</tbody>
					<tfoot className='text-xs 2xl:text-sm'>
						<tr className='bg-primary text-primary-content'>
							<th>Total:</th>
							<th className='text-right'>
								+{totalBoost.toFixed(2) ?? '-'}%
							</th>
							<th className='text-right'>
								{totalCost ?? '-'} CR
							</th>
							<th
								className='text-right max-md:hidden'
								title={totalCostToBoost.toString()}
							>
								{totalCostToBoost.toFixed(0) || '-'} CR/Boost
							</th>
						</tr>
					</tfoot>
				</table>
			</div>
		</>
	);
}
