import Link from 'next/link';
import { FaTriangleExclamation } from 'react-icons/fa6';

interface Props {
	partMissing: boolean;
}

const MissingPartAlert = ({ partMissing }: Props) => {
	if (!partMissing) return null;

	return (
		<div role="alert" className="alert alert-warning py-2 px-4 mb-4">
			<FaTriangleExclamation aria-hidden />
			<div>
				<p className="text-sm font-bold">
					Some parts are missing data! Please double check within the
					game.
					<br />
					<span className="text-xs font-normal">
						Any help filling in the missing data is welcome!{' '}
						<Link
							className="link"
							target="_blank"
							href="https://github.com/TryphonX/CMS-Tuning-Calculator/issues/new"
						>
							Open an issue on GitHub.
						</Link>
					</span>
				</p>
			</div>
		</div>
	);
};

export default MissingPartAlert;
