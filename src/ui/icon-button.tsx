import { IconButton as AstryxIconButton } from '@astryxdesign/core/IconButton';
import { type Glyph, toGlyphElement } from './glyphs';
import { toVariant } from './internal/adapter';
import type { Size, Tone } from './tokens';

export type IconButtonProps = {
	label: string;
	glyph: Glyph;
	tone?: Tone;
	size?: Size;
	isRaised?: boolean;
	isDisabled?: boolean;
	onPress?: () => void;
};

export function IconButton({
	label,
	glyph,
	tone = 'quiet',
	size = 'md',
	isRaised,
	isDisabled,
	onPress,
}: IconButtonProps) {
	return (
		<AstryxIconButton
			label={label}
			tooltip={label}
			icon={toGlyphElement(glyph)}
			variant={toVariant(tone)}
			size={size}
			elevation={isRaised ? 'med' : 'none'}
			isDisabled={isDisabled}
			onClick={onPress}
		/>
	);
}
