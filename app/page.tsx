import Link from 'next/link';
import { FaGithub } from 'react-icons/fa6';

export default function Home() {
	return (
		<div className='hero min-h-screen bg-base-200'>
			<div className='hero-content text-center'>
				<div>
					<figure>
						<picture className='justify-center flex'>
							<img
								className='rounded-full size-3/12'
								src='/images/Avatar2020.png'
								alt='avatar'
							/>
						</picture>
					</figure>
					<h1 className='text-5xl font-bold'>
						About Tuning Calculator
					</h1>
					<div className='py-6 space-y-4'>
						<p>
							Introducing &quot;Tuning Calculator&quot; &ndash;
							your go-to utility app for optimizing engine tuning
							in Car Mechanic Simulator 21. Tackling the often
							laborious task of filtering parts eligible for
							tuning, this app streamlines the process, saving you
							valuable time.
						</p>
						<p>
							The app boasts a comprehensive database of available
							parts, offering vital information such as cost,
							performance boost, and the cost-to-boost ratio. With
							this data at your fingertips, making informed
							decisions becomes effortless.
						</p>
						<p>
							Maintaining realism, the app only presents complete
							solutions where either the same part will be tuned
							everywhere on the engine or will not be tuned at
							all, ensuring authenticity in your tuning endeavors.
							Whether you&apos;re aiming for a specific
							performance boost percentage or prefer a hands-on
							approach, &quot;Tuning Calculator&quot; has you
							covered. It can either calculate the optimal setup
							based on your desired boost increase, or you can
							manually select parts for your custom build.
						</p>
						<p>
							Say goodbye to guesswork and hello to precision
							tuning with &quot;Tuning Calculator&quot; &ndash;
							your ultimate companion for achieving peak
							performance in Car Mechanic Simulator 21.
							<span className='block text-xs opacity-30'>
								Don&apos;t go through the effort of running this
								text through ai detectors; I was lazy, I admit
								it.
							</span>
						</p>
					</div>

					<div className='flex-col space-y-4'>
						<Link className='block' href='/calculator'>
							<button className='btn btn-primary btn-wide'>
								Try it out now!
							</button>
						</Link>
						<Link
							className='block'
							href='https://github.com/TryphonX/CMS-Tuning-Calculator'
							target='_blank'
						>
							<button className='btn btn-secondary btn-sm'>
								<FaGithub /> Source code
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
