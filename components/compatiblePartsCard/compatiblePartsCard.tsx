import { Action, BaseProps } from '@/@types/globals';
import Card from '../card/card';
import CompatiblePartsTable from './compatiblePartsTable';
import { FaEraser, FaWandMagicSparkles } from 'react-icons/fa6';
import { UpdateSelectedPartsEvent } from '@/modules/customEvents';
import { useContext, useMemo } from 'react';
import { CalculatorContext } from '@/modules/contexts';
import AutoGenModal from '../autoGenModal/autoGenModal';

const AUTO_GEN_MODAL_ID = 'autoGenModal';

export default function CompatiblePartsCard({ className }: BaseProps) {
	const { currentEngine, selectedParts } = useContext(CalculatorContext);

	const autoGenerateAction: Action = useMemo<Action>(
		() => ({
			label: (
				<>
					<FaWandMagicSparkles /> Auto-generate
				</>
			),
			disabled: !currentEngine,
			variant: 'primary',
			onClick: () => {
				const modal = document.getElementById(AUTO_GEN_MODAL_ID);

				if (modal) {
					(modal as HTMLDialogElement).showModal();
				}
			},
		}),
		[currentEngine],
	);

	const clearAction: Action = {
		label: (
			<>
				<FaEraser /> Clear
			</>
		),
		disabled: !selectedParts.length,
		variant: 'error',
		onClick: () => UpdateSelectedPartsEvent.dispatch([]),
	};

	const actions = [autoGenerateAction];
	const footerActions = [clearAction];

	return (
		<>
			<Card
				title='Compatible Parts'
				className={className}
				actions={actions}
				footerActions={footerActions}
			>
				<div className='mt-4'>
					<CompatiblePartsTable />
				</div>
			</Card>
			<AutoGenModal id={AUTO_GEN_MODAL_ID} />
		</>
	);
}
