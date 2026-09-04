import { Button, Sheet, Stack, Text, Title } from '../ui/index';
import { PRESETS } from '../state/mix';
import type { Mixer } from '../state/useMixer';

export type PresetSheetProps = {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	mixer: Mixer;
};

export function PresetSheet({ isOpen, onOpenChange, mixer }: PresetSheetProps) {
	return (
		<Sheet label="Blends" isOpen={isOpen} onOpenChange={onOpenChange} height="capped">
			<Stack gap="md" padding="sm">
				<Stack gap="xs">
					<Title level={2}>Blends</Title>
					<Text tone="muted" variant="caption">
						A starting point. Everything stays adjustable afterwards.
					</Text>
				</Stack>
				<Stack gap="xs">
					{PRESETS.map((preset) => (
						<Button
							key={preset.id}
							label={preset.name}
							tone="quiet"
							onPress={() => {
								mixer.loadMix(preset.levels);
								onOpenChange(false);
							}}
						/>
					))}
				</Stack>
			</Stack>
		</Sheet>
	);
}
