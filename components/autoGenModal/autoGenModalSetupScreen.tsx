import { TuningSetup } from '@/@types/calculator';
import { FaArrowRotateLeft, FaArrowsRotate } from 'react-icons/fa6';

type AutoGenModalSetupScreenProps = {
	generatedSetup?: TuningSetup;
	onApply: () => void;
	onDiscard: () => void;
};

export default function AutoGenModalSetupScreen({
	generatedSetup,
	onApply,
	onDiscard,
}: AutoGenModalSetupScreenProps) {
	if (!generatedSetup) return;

	return (
		<div>
			<div className='my-4 overflow-x-auto w-full border rounded-2xl border-base-200'>
				<table className='table table-md sm:table-lg table-zebra'>
					<tbody>
						<tr>
							<th>Boost</th>
							<td>{generatedSetup.boost}%</td>
						</tr>
						<tr>
							<th>Cost</th>
							<td>{generatedSetup.cost} CR</td>
						</tr>
						<tr>
							<th>Cost / Boost</th>
							<td>
								{generatedSetup.costToBoost.toFixed(2)} CR /
								Boost
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className='justify-between modal-action'>
				<button className='btn btn-neutral' onClick={onDiscard}>
					<FaArrowRotateLeft /> Discard
				</button>
				<button className='btn btn-primary' onClick={onApply}>
					<FaArrowsRotate /> Apply changes
				</button>
			</div>
		</div>
	);
}
