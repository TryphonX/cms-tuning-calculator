import Image from 'next/image';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa6';

export default function Footer() {
	return (
		<footer className="footer items-center p-4 bg-neutral text-neutral-content">
			<aside className="items-center grid-flow-col">
				<Link
					target="_blank"
					href="https://tryphonx.github.io/"
					aria-label="To TryphonX's Portfolio"
				>
					<Image
						className="rounded-full"
						aria-hidden
						width={54}
						height={54}
						src="/CMS-Tuning-Calculator/images/Avatar2020.webp"
						alt="TryphonX's avatar"
					/>
				</Link>
				<p>
					Copyright © {new Date().getFullYear()} - All right reserved
				</p>
			</aside>
			<div className="flex flex-row max-md:w-full max-md:justify-center items-center md:place-self-center md:justify-self-end">
				<p>
					<span className="text-primary font-semibold">v2.1.1</span> |
					October 20, 2024
				</p>
				<nav className="flex max-md:w-full max-md:justify-center max-md:items-center md:place-self-center md:justify-self-end">
					<Link
						href="https://github.com/TryphonX/CMS-Tuning-Calculator/issues/new"
						target="_blank"
					>
						<button className="btn btn-primary btn-sm">
							<FaGithub aria-hidden /> Open an issue
						</button>
					</Link>
				</nav>
			</div>
		</footer>
	);
}
