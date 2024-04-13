import Card from '../card/card';
import SelectedPartsTable from './selectedPartsTable';

export default function SelectedPartsCard() {
	return (
		<Card title='Selected Parts'>
			<div className='mt-4'>
				<SelectedPartsTable />
			</div>
		</Card>
	);
}
