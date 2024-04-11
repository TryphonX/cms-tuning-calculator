import { ReactNode } from 'react';

export type BaseProps = {
	className?: string
}

export type BasePropsWithChildren = BaseProps & {
	children?: ReactNode
}