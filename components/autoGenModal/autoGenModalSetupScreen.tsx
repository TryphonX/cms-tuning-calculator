import { TuningSetup } from '@/@types/calculator';
import { FaArrowRotateLeft, FaArrowsRotate } from 'react-icons/fa6';

type AutoGenModalSetupScreenProps = {
	generatedSetup?: TuningSetup | null;
	onApply: () => void;
	onDiscard: () => void;
};

interface CostElementProps {
	generatedSetup: TuningSetup;
}

const CostElement = ({ generatedSetup }: CostElementProps) => {
	if (!generatedSetup.repairs?.includesRepairParts) {
		return `${generatedSetup.cost} CR`;
	}

	return (
		<div className="flex flex-row gap-4 items-center">
			<del className="text-xs">
				<span className="sr-only">Original cost was </span>
				{generatedSetup.cost} CR
			</del>
			<span className="font-semibold">
				<span className="sr-only">New cost is </span>
				{generatedSetup.repairs.netCost} CR
			</span>
			<div
				className="badge badge-primary font-semibold"
				aria-label={`Total saved after repairs: ${generatedSetup.repairs.totalSaved} CR`}
			>
				-{generatedSetup.repairs.totalSaved} CR *
			</div>
		</div>
	);
};

const CostToBoostElement = ({ generatedSetup }: CostElementProps) => {
	if (!generatedSetup.repairs?.includesRepairParts) {
		return `${generatedSetup.costToBoost.toFixed(2)} CR / Boost`;
	}

	return (
		<div className="flex flex-row gap-4 items-center">
			<del className="text-xs">
				<span className="sr-only">Original cost per boost was </span>
				{generatedSetup.costToBoost.toFixed(2)} CR / Boost
			</del>
			<span className="font-semibold">
				<span className="sr-only">New cost per boost is </span>
				{generatedSetup.repairs.netCostToBoost.toFixed(2)} CR / Boost
			</span>
			<div
				className="badge badge-primary font-semibold"
				aria-label={`Total saved CR per boost after repairs: ${(
					generatedSetup.costToBoost -
					generatedSetup.repairs.netCostToBoost
				).toFixed(2)} CR`}
			>
				-
				{(
					generatedSetup.costToBoost -
					generatedSetup.repairs.netCostToBoost
				).toFixed(2)}{' '}
				CR / Boost *
			</div>
		</div>
	);
};

export default function AutoGenModalSetupScreen({
	generatedSetup,
	onApply,
	onDiscard,
}: AutoGenModalSetupScreenProps) {
	return (
		<div className="my-4">
			{generatedSetup ? (
				<>
					<div className="overflow-x-auto w-full border rounded-2xl border-base-200">
						<table className="table table-md sm:table-lg table-zebra">
							<tbody>
								<tr>
									<th>Boost</th>
									<td>{generatedSetup.boost.toFixed(2)}%</td>
								</tr>
								<tr>
									<th>Cost</th>
									<td>
										<CostElement
											generatedSetup={generatedSetup}
										/>
									</td>
								</tr>
								<tr>
									<th>Cost / Boost</th>
									<td>
										<CostToBoostElement
											generatedSetup={generatedSetup}
										/>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					{generatedSetup.repairs?.includesRepairParts && (
						<div className="mt-4 flex flex-col gap-2">
							<p className="text-xs">
								* Some parts were repaired in this setup. The
								cost shown has deducted the price that part
								would need to be replaced. Combining the repair
								with the tuning has led to a more profitable
								tuning. After applying changes, the cost will be
								shown as the total cost (not net cost after
								repairs). Do not be alarmed, it is only shown
								here to let you know why this setup was chosen
								over others that might seem cheaper, because
								they do not take the repairs into consideration.
							</p>
							<p className="text-sm text-primary">
								Repairing:{' '}
								{generatedSetup.repairs.repairPartNames.join(
									', ',
								)}
							</p>
						</div>
					)}
				</>
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
