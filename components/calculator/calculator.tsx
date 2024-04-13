'use client';

import EngineCard from '../engineCard/engineCard';
import CompatiblePartsCard from '../compatiblePartsCard/compatiblePartsCard';
import CalculatorWrapper from './calculatorWrapper';

export default function Calculator() {
	return (
		<CalculatorWrapper>
			<div className='grid grid-flow-row grid-rows-2 grid-cols-5 gap-8 m-8'>
				<EngineCard />
				<CompatiblePartsCard />
			</div>
		</CalculatorWrapper>
	);
}
