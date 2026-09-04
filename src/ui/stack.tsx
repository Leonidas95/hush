import { HStack as AstryxHStack } from '@astryxdesign/core/HStack';
import { VStack as AstryxVStack } from '@astryxdesign/core/VStack';
import type { ReactNode } from 'react';
import { toStep } from './internal/adapter';
import type { Align, Distribute, Space } from './tokens';

export type StackProps = {
	gap?: Space;
	padding?: Space;
	align?: Align;
	distribute?: Distribute;
	wrap?: boolean;
	children: ReactNode;
};

export function Stack({ gap, padding, align, distribute, wrap, children }: StackProps) {
	return (
		<AstryxVStack
			gap={toStep(gap)}
			padding={toStep(padding)}
			align={align}
			justify={distribute}
			wrap={wrap ? 'wrap' : 'nowrap'}
		>
			{children}
		</AstryxVStack>
	);
}

export function Row({ gap, padding, align, distribute, wrap, children }: StackProps) {
	return (
		<AstryxHStack
			gap={toStep(gap)}
			padding={toStep(padding)}
			align={align}
			justify={distribute}
			wrap={wrap ? 'wrap' : 'nowrap'}
		>
			{children}
		</AstryxHStack>
	);
}
