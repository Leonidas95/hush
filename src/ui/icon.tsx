import { Icon as AstryxIcon } from '@astryxdesign/core/Icon';
import { type Glyph, toGlyphComponent } from './glyphs';
import type { Size } from './tokens';

export type IconProps = {
	glyph: Glyph;
	size?: Size;
	tone?: 'default' | 'muted' | 'accent';
	label?: string;
};

const TONE = { default: 'primary', muted: 'secondary', accent: 'accent' } as const;

export function Icon({ glyph, size = 'md', tone, label }: IconProps) {
	return (
		<AstryxIcon
			icon={toGlyphComponent(glyph)}
			size={size}
			color={tone ? TONE[tone] : undefined}
			label={label}
		/>
	);
}
