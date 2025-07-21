import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Head from 'next/head';

const ubuntu = Montserrat({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Tuning Calculator',
	description:
		'Web app that makes tuning cars in Car Mechanic Simulator 21 easier.',
	authors: { name: 'Tryfon Xydas' },
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
		<html lang="en" data-theme="dark">
			<Head>
				<link
					rel="preload"
					as="image"
					href="/CMS-Tuning-Calculator/images/logo.svg"
				/>
				<link
					rel="preload"
					as="image"
					href="/CMS-Tuning-Calculator/images/Avatar2020.webp"
				/>
			</Head>
			<body className={`${ubuntu.className} flex flex-col min-h-svh`}>
				<Navbar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
