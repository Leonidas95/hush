import { Heading as AstryxHeading } from '@astryxdesign/core/Heading';
import { Text as AstryxText } from '@astryxdesign/core/Text';
import type { ReactNode } from 'react';
import type { TextTone, TextVariant } from './tokens';

const TONE: Record<TextTone, 'primary' | 'secondary' | 'accent' | 'disabled'> = {
	default: 'primary',
	muted: 'secondary',
	accent: 'accent',
	disabled: 'disabled',
};

const VARIANT: Record<TextVariant, 'body' | 'large' | 'label' | 'supporting' | 'code'> = {
	body: 'body',
	lead: 'large',
	label: 'label',
	caption: 'supporting',
	code: 'code',
};

export type TextProps = {
	variant?: TextVariant;
	tone?: TextTone;
	maxLines?: number;
	children: ReactNode;
};

export function Text({ variant = 'body', tone, maxLines, children }: TextProps) {
	return (
		<AstryxText type={VARIANT[variant]} color={tone && TONE[tone]} maxLines={maxLines}>
			{children}
		</AstryxText>
	);
}

export type TitleProps = {
	level?: 1 | 2 | 3 | 4 | 5 | 6;
	tone?: TextTone;
	children: ReactNode;
};

export function Title({ level = 2, tone, children }: TitleProps) {
	return (
		<AstryxHeading level={level} color={tone && TONE[tone]}>
			{children}
		</AstryxHeading>
	);
}
