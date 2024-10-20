import { TuningSetup } from '@/@types/calculator';
import { FaArrowRotateLeft, FaArrowsRotate } from 'react-icons/fa6';

type AutoGenModalSetupScreenProps = {
	generatedSetup?: TuningSetup | null;
	onApply: () => void;
	onDiscard: () => void;
};

export default function AutoGenModalSetupScreen({
	generatedSetup,
	onApply,
	onDiscard,
}: AutoGenModalSetupScreenProps) {
	return (
		<div className="my-4">
			{generatedSetup ? (
				<div className="overflow-x-auto w-full border rounded-2xl border-base-200">
					<table className="table table-md sm:table-lg table-zebra">
						<tbody>
							<tr>
								<th>Boost</th>
								<td>{generatedSetup.boost.toFixed(2)}%</td>
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
			) : (
				<p>There is no possible setup configuration.</p>
			)}
			<div className="justify-between modal-action">
				<button className="btn btn-secondary" onClick={onDiscard}>
					<FaArrowRotateLeft aria-hidden /> Discard
				</button>
				<button
					className="btn btn-primary"
					disabled={!generatedSetup}
					onClick={onApply}
				>
					<FaArrowsRotate aria-hidden /> Apply changes
				</button>
			</div>
		</div>
	);
}
