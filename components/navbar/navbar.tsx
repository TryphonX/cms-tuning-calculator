import { FaPaypal } from 'react-icons/fa6';

export default function Navbar() {
	return (
		<div className="navbar bg-base-100">
			<div className="flex-1">
				<a className='btn btn-ghost' href='#'>
					<span className="text-xl">Tuning Calculator</span>
					<span className='hidden sm:block font-light text-secondary'>Car Mechanic Simulator 21</span>
				</a>
			</div>
			<div className="flex-none">
				<button className="btn btn-sm md:btn-md btn-secondary">
					<FaPaypal /> Donate
				</button>
			</div>
		</div>
	);
}