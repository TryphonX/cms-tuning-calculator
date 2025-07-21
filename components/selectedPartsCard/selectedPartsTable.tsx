'use client';

import { CalculatorContext } from '@/modules/contexts';
import { useContext, useEffect, useState } from 'react';
import { UpdateSortEvent } from '@/modules/customEvents';
import { partSortFn, getFullPartByName } from '@/modules/common';
import { PartSortBy } from '@/@types/globals';
import SortBtn from '../SortBtn';

export default function SelectedPartsTable() {
	const { currentEngine, selectedParts } = useContext(CalculatorContext);

	const [sortBy, setSortBy] = useState<PartSortBy>('name_asc');

	// onMount
	useEffect(() => {
		const handleUpdateSort = (e: Event) => {
			e.stopPropagation();
			setSortBy((e as CustomEvent<PartSortBy>).detail ?? 'name_asc');
		};

		window.addEventListener(UpdateSortEvent.name, handleUpdateSort);

		return () => {
			window.removeEventListener(UpdateSortEvent.name, handleUpdateSort);
		};
	}, []);

	if (!currentEngine) return;

	const sortedSelectedParts = selectedParts.sort(partSortFn(sortBy));

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
			<div className="overflow-x-auto w-full rounded-2xl border border-base-200">
				<table className="table table-sm sm:table-md xl:table-md table-zebra">
					<thead className="text-sm">
						<tr>
							<th className="w-1/2 xl:w-1/3 2xl:w-1/2">
								Part{' '}
								<SortBtn
									sortBy={sortBy}
									values={['name_asc', 'name_desc']}
								/>
							</th>
							<th className="text-right">
								Boost{' '}
								<SortBtn
									sortBy={sortBy}
									values={['boost_asc', 'boost_desc']}
								/>
							</th>
							<th className="text-right">
								Cost{' '}
								<SortBtn
									sortBy={sortBy}
									values={['cost_asc', 'cost_desc']}
								/>
							</th>
							<th className="text-right max-md:hidden">
								Cost / Boost{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										'costToBoost_asc',
										'costToBoost_desc',
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
								<tr
									key={`${part.name.replaceAll(
										' ',
										'-',
									)}-row`}
								>
									<td>
										x{part.quantity} {part.name}
									</td>
									<td className="text-right">
										+
										{(
											tuningPartData?.boost *
											part.quantity
										).toFixed(2)}
										%
									</td>
									<td className="text-right">
										{tuningPartData?.cost * part.quantity}{' '}
										CR
									</td>
									<td
										className="text-right max-md:hidden"
										title={(
											tuningPartData?.cost /
											tuningPartData?.boost
										).toString()}
									>
										{(
											tuningPartData?.cost /
											tuningPartData?.boost
										).toFixed(0)}{' '}
										CR/Boost
									</td>
								</tr>
							);
						})}
					</tbody>
					<tfoot className="text-xs 2xl:text-sm">
						<tr className="bg-primary text-primary-content">
							<th>Total:</th>
							<th className="text-right">
								+{totalBoost.toFixed(2)}%
							</th>
							<th className="text-right">{totalCost} CR</th>
							<th
								className="text-right max-md:hidden"
								title={totalCostToBoost.toString()}
							>
								{totalCostToBoost.toFixed(0)} CR/Boost
							</th>
						</tr>
					</tfoot>
				</table>
			</div>
		</>
	);
}
