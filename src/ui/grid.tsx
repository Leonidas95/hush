import { Grid as AstryxGrid } from '@astryxdesign/core/Grid';
import type { ReactNode } from 'react';
import { toStep } from './internal/adapter';
import type { Space } from './tokens';

export type GridProps = {
	minColumnWidth?: number;
	maxColumns?: number;
	gap?: Space;
	children: ReactNode;
};

export function Grid({ minColumnWidth = 160, maxColumns, gap = 'md', children }: GridProps) {
	return (
		<AstryxGrid
			columns={{ minWidth: minColumnWidth, max: maxColumns, repeat: 'fit' }}
			gap={toStep(gap)}
		>
			{children}
		</AstryxGrid>
	);
}
