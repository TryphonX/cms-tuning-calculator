import AboutSection from '@/components/AboutSection';
import GithubIssueSection from '@/components/GithubIssueSection';

export default function Home() {
	return (
		<>
			<div className="relative">
				<div className="bg-linear-to-b from-base-100 via-base-300 to-base-100 absolute w-full h-full" />
				<AboutSection />
			</div>
			<GithubIssueSection />
		</>
	);
}
