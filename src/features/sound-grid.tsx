import { Grid, LevelTile } from '../ui/index';
import { SOUNDS } from '../sounds/catalog';
import type { Mixer } from '../state/useMixer';

export function SoundGrid({ mixer }: { mixer: Mixer }) {
	return (
		<Grid minColumnWidth={148} gap="sm">
			{SOUNDS.map((sound) => (
				<LevelTile
					key={sound.id}
					label={sound.name}
					glyph={sound.glyph}
					accent={sound.accent}
					isActive={mixer.levelOf(sound.id) > 0}
					onToggle={() => mixer.toggle(sound.id)}
					level={mixer.levelOf(sound.id)}
					onLevelChange={(level) => mixer.setLevel(sound.id, level)}
				/>
			))}
		</Grid>
	);
}
