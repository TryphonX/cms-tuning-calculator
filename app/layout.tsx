import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';

const ubuntu = Montserrat({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Tuning Calculator',
	description:
		'Web app that makes tuning cars in Car Mechanic Simulator 21 easier.',
	authors: { name: 'Tryphon Ksydas' },
	icons: '/favicon.ico',
	keywords: [
		'Car Mechanic Simulator',
		'CMS21',
		'Car',
		'Mechanic',
		'Simulator',
		'21',
		'CMS',
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang='en' data-theme='dark'>
			<body className={ubuntu.className}>{children}</body>
		</html>
	);
}
