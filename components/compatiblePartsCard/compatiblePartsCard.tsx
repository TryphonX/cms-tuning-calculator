import { BaseProps } from '@/@types/globals';
import Card from '../card/card';
import CompatiblePartsTable from './compatiblePartsTable';

export default function CompatiblePartsCard({ className }: BaseProps) {
	return (
		<Card title='Compatible Parts' className={className}>
			<div className='mt-4'>
				<CompatiblePartsTable />
			</div>
		</Card>
	);
}
