import Image from 'next/image';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa6';

export default function Footer() {
	const dateString = new Date(
		process.env.LAST_PUBLISH as string,
	).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: '2-digit',
	});

	return (
		<footer className="footer md:footer-horizontal items-center p-4 bg-base-300 text-neutral-content">
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
						src="/cms-tuning-calculator/images/Avatar2020.webp"
						alt="TryphonX's avatar"
					/>
				</Link>
				<div className="space-y-1">
					<p>
						Copyright © {new Date().getFullYear()} - All right
						reserved
					</p>
					<p className="text-xs text-base-content/80">
						<span className="text-primary font-semibold">
							v{process.env.APP_VERSION}
						</span>{' '}
						| {dateString}
					</p>
				</div>
			</aside>
			<div className="flex flex-row max-md:w-full max-md:justify-center items-center md:place-self-center md:justify-self-end">
				<nav className="flex max-md:w-full max-md:justify-center max-md:items-center md:place-self-center md:justify-self-end">
					<Link
						href="https://github.com/TryphonX/cms-tuning-calculator/issues/new"
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
