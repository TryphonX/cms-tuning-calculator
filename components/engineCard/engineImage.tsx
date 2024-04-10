'use client';

import { CalculatorContext } from '@/modules/contexts';
import { useContext } from 'react';

export default function EngineImage() {

	const { currentEngine } = useContext(CalculatorContext);

	if (!currentEngine) return;

	return (
		<figure>
			<picture>
				<img className='w-full rounded-lg' src={currentEngine.imgUrl} alt={`${currentEngine?.name} image`} />
			</picture>
		</figure>
	);
}