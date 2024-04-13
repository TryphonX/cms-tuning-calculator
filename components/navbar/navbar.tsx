import { FaPaypal } from 'react-icons/fa6';

export default function Navbar() {
	return (
		<div className='navbar bg-base-100'>
			<div className='flex-1'>
				<a className='btn btn-ghost' href='#'>
					<span className='text-xl'>Tuning Calculator</span>
					<span className=' max-sm:hidden font-light text-secondary'>
						Car Mechanic Simulator 21
					</span>
				</a>
			</div>
			<div className='flex-none'>
				<a href='https://paypal.me/TryphonKsydas' target='_blank'>
					<button className='btn btn-sm btn-secondary'>
						<FaPaypal /> Donate
					</button>
				</a>
			</div>
		</div>
	);
}
