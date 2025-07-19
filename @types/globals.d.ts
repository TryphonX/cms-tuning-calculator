import { ReactNode } from 'react';

export type BaseProps = {
	className?: string;
};

export type BasePropsWithChildren = BaseProps & {
	children?: ReactNode;
};

export type PartSortBy =
	| 'name_asc'
	| 'name_desc'
	| 'quantity_asc'
	| 'quantity_desc'
	| 'cost_asc'
	| 'cost_desc'
	| 'boost_asc'
	| 'boost_desc'
	| 'costToBoost_asc'
	| 'costToBoost_desc';

export type Action = {
	className?: string;
	disabled?: boolean;
	label: ReactNode | ReactNode[];
	optionalLabel?: ReactNode | ReactNode[];
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
