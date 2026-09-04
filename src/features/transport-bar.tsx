import { Icon, IconButton, Row, Slider, Stack, Text } from '../ui/index';
import { isSilent } from '../state/mix';
import type { Mixer } from '../state/useMixer';

const formatClock = (totalSeconds: number): string => {
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const describe = (mixer: Mixer): string => {
	if (mixer.sleepRemaining !== null) return `Fading out in ${formatClock(mixer.sleepRemaining)}`;
	const count = Object.values(mixer.levels).filter((level) => level > 0).length;
	if (count === 0) return 'Pick a sound to begin';
	if (!mixer.isPlaying) return count === 1 ? '1 sound, paused' : `${count} sounds, paused`;
	return count === 1 ? '1 sound' : `${count} sounds`;
};

export function TransportBar({ mixer }: { mixer: Mixer }) {
	const isEmpty = isSilent(mixer.levels);

	return (
		<Stack gap="xs" padding="xs">
			<Row gap="sm" align="center">
				<IconButton
					label={mixer.isPlaying ? 'Pause' : 'Play'}
					glyph={mixer.isPlaying ? 'pause' : 'play'}
					tone="primary"
					size="lg"
					isRaised
					isDisabled={isEmpty}
					onPress={mixer.togglePlaying}
				/>
				<Text variant="caption" tone="muted">
					{describe(mixer)}
				</Text>
			</Row>
			<Row gap="sm" align="center">
				<Icon glyph={mixer.master === 0 ? 'mute' : 'volume'} size="sm" tone="muted" />
				<Slider
					label="Overall volume"
					isLabelHidden
					value={mixer.master}
					onChange={mixer.setMaster}
					format={(value) => `${value}%`}
				/>
			</Row>
		</Stack>
	);
}
