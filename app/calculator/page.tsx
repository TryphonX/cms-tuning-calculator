'use client';

import CalculatorWrapper from '@/components/calculatorWrapper/calculatorWrapper';
import CompatiblePartsCard from '@/components/compatiblePartsCard/compatiblePartsCard';
import EngineCard from '@/components/engineCard/engineCard';
import SelectedPartsCard from '@/components/selectedPartsCard/selectedPartsCard';

export default function Calculator() {
	return (
		<CalculatorWrapper>
			<div
				className='
				flex flex-col
				lg:flex lg:flex-col
				xl:grid xl:grid-flow-row xl:grid-cols-5 xl:gap-8 m-8'
			>
				<div className='xl:col-span-2 flex-col space-y-8'>
					<EngineCard />
					<SelectedPartsCard className='max-xl:hidden' />
					<CompatiblePartsCard className='xl:hidden' />
				</div>
				<div className='xl:col-span-3 flex-col space-y-8'>
					<CompatiblePartsCard className='max-xl:hidden' />
					<SelectedPartsCard className='xl:hidden' />
				</div>
			</div>
		</CalculatorWrapper>
	);
}
