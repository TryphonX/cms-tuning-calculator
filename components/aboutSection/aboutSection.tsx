import Link from 'next/link';
import { FaPlay, FaGithub } from 'react-icons/fa6';

export default function AboutSection() {
	return (
		<div className='hero min-h-screen bg-base-200'>
			<div className='hero-content text-center p-8'>
				<div>
					<figure className='mb-6'>
						<picture className='justify-center flex'>
							<img
								className='rounded-full size-4/12 md:size-1/4 lg:size-1/6'
								src='/images/logo.svg'
								alt='tuning calculator logo'
							/>
						</picture>
					</figure>
					<h1 className='text-5xl font-bold'>
						About Tuning Calculator
					</h1>
					<div className='py-6 space-y-4'>
						<p>
							Introducing <strong>Tuning Calculator</strong>{' '}
							&ndash;{' '}
							<strong>
								your go-to utility app for optimizing engine
								tuning in Car Mechanic Simulator 21
							</strong>
							. Tackling the often laborious task of filtering
							parts eligible for tuning, this app streamlines the
							process, saving you valuable time.
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
							approach, <strong>Tuning Calculator</strong> has you
							covered. It can either calculate the optimal setup
							based on your desired boost increase, or you can
							manually select parts for your custom build.
						</p>
						<p>
							Say goodbye to guesswork and hello to precision
							tuning with <strong>Tuning Calculator</strong>{' '}
							&ndash;{' '}
							<strong>
								your ultimate companion for achieving peak
								performance in Car Mechanic Simulator 21
							</strong>
							.
							<span className='block text-xs opacity-30'>
								Don&apos;t go through the effort of running this
								text through ai detectors; I was lazy, I admit
								it.
							</span>
						</p>
						<p className='text-xs opacity-50'>
							This app is a personal project and is not associated
							with the makers and/or publishers of the game in any
							way shape or form.
						</p>
					</div>

					<div className='flex-col space-y-4'>
						<div>
							<Link className='block' href='/calculator'>
								<button className='btn btn-primary btn-wide'>
									<FaPlay /> Try it out now!
								</button>
							</Link>
						</div>
						<div>
							<Link
								href='https://github.com/TryphonX/CMS-Tuning-Calculator'
								target='_blank'
							>
								<button className='btn btn-accent btn-sm'>
									<FaGithub /> Source code
								</button>
							</Link>
							<p className='text-xs opacity-50 mt-2'>
								This project is open-source. Licensed under{' '}
								<Link
									className='link'
									href='https://github.com/TryphonX/CMS-Tuning-Calculator/blob/main/COPYING.txt'
									target='_blank'
								>
									GNU GENERAL PUBLIC LICENSE v3
								</Link>
								.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
