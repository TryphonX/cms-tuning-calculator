/** @type {import('next').NextConfig} */
const nextConfig = {
	basePath: '/CMS-Tuning-Calculator',
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'static.wikia.nocookie.net',
			},
		],
	},
};

export default nextConfig;
