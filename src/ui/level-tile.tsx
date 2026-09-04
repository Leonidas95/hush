import { Card } from '@astryxdesign/core/Card';
import { ToggleButton } from '@astryxdesign/core/ToggleButton';
import { VStack } from '@astryxdesign/core/VStack';
import { type Glyph, toGlyphElement } from './glyphs';
import { Slider } from './slider';
import type { Accent } from './tokens';

export type LevelTileProps = {
	label: string;
	glyph: Glyph;
	accent?: Accent;
	isActive: boolean;
	onToggle: () => void;
	level: number;
	onLevelChange: (level: number) => void;
};

export function LevelTile({
	label,
	glyph,
	accent = 'blue',
	isActive,
	onToggle,
	level,
	onLevelChange,
}: LevelTileProps) {
	return (
		<Card variant={isActive ? accent : 'muted'} elevation={isActive ? 'low' : 'none'} padding={2}>
			<VStack gap={1.5}>
				<ToggleButton
					label={label}
					isPressed={isActive}
					onPressedChange={onToggle}
					icon={toGlyphElement(glyph)}
					size="sm"
				/>
				<Slider
					label={`${label} level`}
					isLabelHidden
					value={level}
					onChange={onLevelChange}
					format={(value) => `${value}%`}
				/>
			</VStack>
		</Card>
	);
}
