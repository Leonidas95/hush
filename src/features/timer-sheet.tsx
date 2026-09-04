import { Button, Sheet, Stack, Text, Title } from '../ui/index';
import type { Mixer } from '../state/useMixer';

const OPTIONS = [15, 30, 45, 60, 90, 120] as const;

export type TimerSheetProps = {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	mixer: Mixer;
};

export function TimerSheet({ isOpen, onOpenChange, mixer }: TimerSheetProps) {
	const choose = (minutes: number | null) => {
		mixer.setSleepMinutes(minutes);
		onOpenChange(false);
	};

	return (
		<Sheet label="Sleep timer" isOpen={isOpen} onOpenChange={onOpenChange}>
			<Stack gap="md" padding="sm">
				<Stack gap="xs">
					<Title level={2}>Sleep timer</Title>
					<Text tone="muted" variant="caption">
						The mix fades out over the final half minute, so nothing wakes you.
					</Text>
				</Stack>
				<Stack gap="xs">
					{OPTIONS.map((minutes) => (
						<Button
							key={minutes}
							label={`${minutes} minutes`}
							tone="quiet"
							onPress={() => choose(minutes)}
						/>
					))}
					{mixer.sleepRemaining !== null ? (
						<Button label="Cancel timer" tone="danger" onPress={() => choose(null)} />
					) : null}
				</Stack>
			</Stack>
		</Sheet>
	);
}
