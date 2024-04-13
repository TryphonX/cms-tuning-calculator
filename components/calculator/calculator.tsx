'use client';

import EngineCard from '../engineCard/engineCard';
import CompatiblePartsCard from '../compatiblePartsCard/compatiblePartsCard';
import CalculatorWrapper from './calculatorWrapper';
import SelectedPartsCard from '../selectedPartsCard/selectedPartsCard';

export default function Calculator() {
	return (
		<CalculatorWrapper>
			<div className='grid grid-flow-col grid-cols-5 gap-8 m-8'>
				<div className='col-span-2 flex-col space-y-8'>
					<EngineCard />
					<SelectedPartsCard />
				</div>
				<div className='col-span-3 flex-col space-y-8'>
					<CompatiblePartsCard />
				</div>
			</div>
		</CalculatorWrapper>
	);
}
