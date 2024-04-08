import type { Metadata } from 'next';
import { Ubuntu } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';

const ubuntu = Ubuntu({ weight: '500', subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Tuning Calculator',
	description: 'Web app that makes tuning cars in Car Mechanic Simulator 21 easier.',
	authors: { name: 'Tryphon Ksydas'},
	icons: '/favicon.ico',
	keywords: ['Car Mechanic Simulator', 'CMS21', 'Car', 'Mechanic', 'Simulator', '21', 'CMS'],
};

export default function RootLayout({
	children,
}: Readonly<{
  children: ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={ubuntu.className}>{children}</body>
		</html>
	);
}
