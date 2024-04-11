import Card from '../card/card';
import EngineImage from './engineImage';
import EngineSelect from './engineSelect';
import EngineSpecsTable from './engineSpecsTable';

export default function EngineCard() {

	return (
		<Card title="Engine" className='col-span-2'>
			<EngineSelect className='mb-4 mt-2' />
			<div className='grid grid-flow-row grid-cols-3 gap-4'>
				<EngineImage />
				<EngineSpecsTable />
			</div>
		</Card>
	);
}