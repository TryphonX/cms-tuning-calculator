import packagejson from './package.json' with { type: 'json' };
import { execSync } from 'child_process';

const getIsMainBranch = () => {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim() === 'main';
  } catch (error) {
    console.warn('Could not determine Git branch, defaulting to "main"');
    return true;
  }
};

/** @type {import('next').NextConfig} */
const nextConfig = {
	basePath: '/CMS-Tuning-Calculator',
	env: {
		APP_VERSION: packagejson.version,
		LAST_PUBLISH: getIsMainBranch() ? process.env.LAST_PUBLISH : new Date().toISOString(),
	},
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
