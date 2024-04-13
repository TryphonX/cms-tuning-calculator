'use client';

import { CalculatorContext } from '@/modules/contexts';
import { useContext } from 'react';

export default function EngineSpecsTable() {
	const { currentEngine } = useContext(CalculatorContext);

	if (!currentEngine) return;

	return (
		<figure className='col-span-3 sm:col-span-2 w-full'>
			<div className='overflow-x-auto w-full border rounded-2xl border-base-200'>
				<table className='table table-lg xl:table-md 2xl:table-lg table-zebra'>
					<tbody>
						<tr>
							<th className='w-1/4'>Power</th>
							<td>{currentEngine.specs.power}</td>
						</tr>
						<tr>
							<th>Torque</th>
							<td>{currentEngine.specs.torque}</td>
						</tr>
						<tr>
							<th>Gearbox</th>
							<td>{currentEngine.specs.gearbox}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</figure>
	);
}
