import { Layout, LayoutContent, LayoutFooter, LayoutHeader } from '@astryxdesign/core/Layout';
import type { ReactNode } from 'react';
import { toStep } from './internal/adapter';
import type { Space } from './tokens';

export type ScreenProps = {
	header?: ReactNode;
	footer?: ReactNode;
	maxWidth?: number;
	padding?: Space;
	children: ReactNode;
};

export function Screen({ header, footer, maxWidth = 880, padding = 'md', children }: ScreenProps) {
	return (
		<Layout
			height="fill"
			contentWidth={maxWidth}
			padding={toStep(padding)}
			header={header ? <LayoutHeader>{header}</LayoutHeader> : undefined}
			footer={footer ? <LayoutFooter hasDivider>{footer}</LayoutFooter> : undefined}
			content={<LayoutContent isScrollable>{children}</LayoutContent>}
		/>
	);
}
