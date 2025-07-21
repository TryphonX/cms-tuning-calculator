import Link from 'next/link';
import { FaPaypal } from 'react-icons/fa6';

export default function Navbar() {
	return (
		<div role="navigation" className="navbar bg-base-100">
			<div className="flex-1">
				<Link className="btn btn-ghost" href="/">
					<span className="text-xl">Tuning Calculator</span>
					<span className="text-sm mt-1 max-sm:hidden font-light text-primary">
						Car Mechanic Simulator 21
					</span>
				</Link>
			</div>
			<div className="flex-none">
				<ul className="menu menu-horizontal px-1">
					<li className="max-sm:hidden">
						<Link className="rounded-xl" href="/calculator">
							Calculator
						</Link>
					</li>
					<li className="sm:hidden">
						<details>
							<summary />
							<ul className="p-2 bg-base-100 rounded-t-none z-10">
								<li>
									<Link href="/calculator">Calculator</Link>
								</li>
							</ul>
						</details>
					</li>
				</ul>
				<Link href="https://paypal.me/TryphonKsydas" target="_blank">
					<button className="btn btn-sm btn-primary">
						<FaPaypal /> Donate
					</button>
				</Link>
			</div>
		</div>
	);
}
