'use client';

import { CalculatorContext } from '@/modules/contexts';
import Image from 'next/image';
import { useContext } from 'react';

export default function EngineImage() {
	const { currentEngine } = useContext(CalculatorContext);

	if (!currentEngine) return;

	return (
		<Image
			className="w-full rounded-lg"
			src={currentEngine.imgUrl}
			alt={`${currentEngine?.name}`}
			width={200}
			height={188}
		/>
	);
}
