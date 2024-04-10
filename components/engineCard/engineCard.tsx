import Card from '../card/card';
import EngineImage from './engineImage';
import EngineSelect from './engineSelect';
import EngineSpecsTable from './engineSpecsTable';

export default function EngineCard() {

	return (
		<Card title="Engine" className='col-span-2'>
			<EngineSelect />
			<div className='grid grid-flow-row grid-cols-3 gap-4 mt-4'>
				<EngineImage />
				<EngineSpecsTable />
			</div>
		</Card>
	);
}