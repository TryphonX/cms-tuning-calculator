import Link from 'next/link';
import { FaGithub } from 'react-icons/fa6';

export default function Footer() {
	return (
		<footer className='footer items-center p-4 bg-neutral text-neutral-content'>
			<aside className='items-center grid-flow-col'>
				<picture>
					<img
						width='54'
						height='54'
						src='/images/Avatar2020 (transparent).png'
						alt='avatar'
					/>
				</picture>
				<p>
					Copyright © {new Date().getFullYear()} - All right reserved
				</p>
			</aside>
			<nav className='flex max-md:w-full max-md:justify-center max-md:items-center md:place-self-center md:justify-self-end'>
				<Link
					href='https://github.com/TryphonX/CMS-Tuning-Calculator/issues/new'
					target='_blank'
				>
					<button className='btn btn-primary btn-sm'>
						<FaGithub /> Open an issue
					</button>
				</Link>
			</nav>
		</footer>
	);
}
