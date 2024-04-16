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
			label: <FaWandMagicSparkles />,
			optionalLabel: 'Auto-generate',
			className: 'btn-primary',
			disabled: !currentEngine,
			onClick: () => {
				const modal = document.getElementById(AUTO_GEN_MODAL_ID);

				if (modal) {
					(modal as HTMLDialogElement).showModal();
				}
			},
		}),
		[currentEngine],
	);

	const clearAction: Action = useMemo(
		() => ({
			label: (
				<>
					<FaEraser /> Clear
				</>
			),
			disabled: !selectedParts.length,
			className: 'btn-error max-sm:btn-sm',
			onClick: () => UpdateSelectedPartsEvent.dispatch([]),
		}),
		[selectedParts],
	);

	const actions = [autoGenerateAction];
	const footerActions = [clearAction];

	return (
		<>
			<Card
				title='Available Parts'
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
