/* eslint-env jest */
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
	useRouter() {
		return {
			route: '/',
			pathname: '/',
			query: '',
			asPath: '',
			push: jest.fn(),
			pop: jest.fn(),
			reload: jest.fn(),
			back: jest.fn(),
			prefetch: jest.fn().mockResolvedValue(undefined),
			beforePopState: jest.fn(),
			events: {
				on: jest.fn(),
				off: jest.fn(),
				emit: jest.fn(),
			},
		};
	},
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
	return function MockedImage({ src, alt, ...props }) {
		// eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
		return <img src={src} alt={alt} {...props} />;
	};
});

// Mock Next.js Link component
jest.mock('next/link', () => {
	return function MockedLink({ children, href, ...props }) {
		return (
			<a href={href} {...props}>
				{children}
			</a>
		);
	};
});

// Mock environment variables
process.env.APP_VERSION = '2.2.1';
process.env.LAST_PUBLISH = '2025-01-15T10:00:00.000Z';
