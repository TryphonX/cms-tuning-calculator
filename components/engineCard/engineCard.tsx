import Card from '../card/card';
import EngineImage from './engineImage';
import EngineSelect from './engineSelect';
import EngineSpecsTable from './engineSpecsTable';

export default function EngineCard() {
	return (
		<Card title='Engine'>
			<EngineSelect className='mb-4 mt-2 xl:select-sm' />
			<div className='grid grid-flow-row grid-cols-1 sm:grid-cols-3 gap-4'>
				<EngineImage />
				<EngineSpecsTable />
			</div>
		</Card>
	);
}
