import { BaseProps } from '@/@types/globals';
import Card from '../Card';
import SelectedPartsTable from './SelectedPartsTable';
import { CalculatorContext } from '@/modules/contexts';
import { useContext } from 'react';
import { UnlockEvent } from '@/modules/customEvents';
import { FaUnlock } from 'react-icons/fa6';

export default function SelectedPartsCard({ className }: BaseProps) {
	const { locked } = useContext(CalculatorContext);

	const actions = [
		{
			label: (
				<>
					<FaUnlock aria-hidden /> Unlock
				</>
			),
			className: 'btn-primary',
			onClick: () => {
				UnlockEvent.dispatch();
			},
			disabled: !locked,
		},
	];

	return (
		<Card title="Cart" className={className} actions={actions}>
			<div className="mt-4">
				<SelectedPartsTable />
			</div>
		</Card>
	);
}
