import { Action, BaseProps } from '@/@types/globals';
import Card from '../Card';
import CompatiblePartsTable from './CompatiblePartsTable';
import { FaEraser, FaWandMagicSparkles } from 'react-icons/fa6';
import { UpdateSelectedPartsEvent } from '@/modules/customEvents';
import { useContext, useMemo } from 'react';
import { CalculatorContext } from '@/modules/contexts';
import AutoGenModal from '../AutoGenModal';

const AUTO_GEN_MODAL_ID = 'autoGenModal';

export default function CompatiblePartsCard({ className }: BaseProps) {
	const { currentEngine, selectedParts, locked } =
		useContext(CalculatorContext);

	const autoGenerateAction: Action = useMemo<Action>(
		() => ({
			label: <FaWandMagicSparkles aria-hidden />,
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
					<FaEraser aria-hidden /> Clear
				</>
			),
			disabled: !selectedParts.length || locked,
			className: 'btn-secondary max-sm:btn-sm',
			onClick: () => UpdateSelectedPartsEvent.dispatch([]),
		}),
		[selectedParts, locked],
	);

	const actions = [autoGenerateAction];
	const footerActions = [clearAction];

	return (
		<>
			<Card
				title="Available Parts"
				className={className}
				actions={actions}
				footerActions={footerActions}
			>
				<div className="mt-4">
					<CompatiblePartsTable />
				</div>
			</Card>
			<AutoGenModal id={AUTO_GEN_MODAL_ID} />
		</>
	);
}
