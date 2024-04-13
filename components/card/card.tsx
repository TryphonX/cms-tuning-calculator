import { BasePropsWithChildren } from '@/@types/globals';
import { ReactNode } from 'react';

interface CardProps extends BasePropsWithChildren {
	title?: string;
}

export default function Card(cProps: CardProps) {
	const getClassName = () => (cProps.className ? ` ${cProps.className}` : '');

	const Title = () => {
		if (!cProps.title) return;

		return (
			<>
				<span className='card-title'>{cProps.title}</span>
				<div className='divider my-0'></div>
			</>
		);
	};

	return (
		<div className={`card card-bordered shadow-xl${getClassName()}`}>
			<div className='card-body'>
				<Title />
				{cProps.children}
				<Actions />
			</div>
		</div>
	);
}

interface CardActionsProps {
	children?: ReactNode | ReactNode[];
}

const Actions = (caProps: CardActionsProps) => {
	if (!caProps.children) return;

	return <div className='card-actions justify-end'>{caProps.children}</div>;
};

Card.Actions = Actions;
