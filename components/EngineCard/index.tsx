import Card from '../Card';
import EngineImage from './EngineImage';
import EngineSelect from './EngineSelect';
import EngineSpecsTable from './EngineSpecsTable';

export default function EngineCard() {
	return (
		<Card title="Engine">
			<EngineSelect className="mb-4 mt-2" />
			<div className="grid grid-flow-row grid-cols-1 sm:grid-cols-3 gap-4">
				<EngineImage />
				<EngineSpecsTable />
			</div>
		</Card>
	);
}
