import Card from '../card/card';
import CompatiblePartsTable from './compatiblePartsTable';

export default function CompatiblePartsCard() {
	return (
		<Card title='Compatible Parts'>
			<div className='mt-4'>
				<CompatiblePartsTable />
			</div>
		</Card>
	);
}
