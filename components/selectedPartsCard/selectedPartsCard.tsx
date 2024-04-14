import { BaseProps } from '@/@types/globals';
import Card from '../card/card';
import SelectedPartsTable from './selectedPartsTable';

export default function SelectedPartsCard({ className }: BaseProps) {
	return (
		<Card title='Cart' className={className}>
			<div className='mt-4'>
				<SelectedPartsTable />
			</div>
		</Card>
	);
}
