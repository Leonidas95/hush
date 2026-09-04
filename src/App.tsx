import { Screen, Stack, Text } from './ui/index';
import { useState } from 'react';
import { AppHeader } from './features/app-header';
import { PresetSheet } from './features/preset-sheet';
import { SoundGrid } from './features/sound-grid';
import { TimerSheet } from './features/timer-sheet';
import { TransportBar } from './features/transport-bar';
import { useMixer } from './state/useMixer';

function App() {
	const mixer = useMixer();
	const [isTimerOpen, setIsTimerOpen] = useState(false);
	const [isPresetsOpen, setIsPresetsOpen] = useState(false);

	return (
		<>
			<Screen
				header={
					<AppHeader
						mixer={mixer}
						onOpenTimer={() => setIsTimerOpen(true)}
						onOpenPresets={() => setIsPresetsOpen(true)}
					/>
				}
				footer={<TransportBar mixer={mixer} />}
			>
				<Stack gap="md" padding="xs">
					<SoundGrid mixer={mixer} />
					<Text variant="caption" tone="muted">
						Every sound here is generated in your browser as you listen, nothing is downloaded,
						nothing is recorded, and no account is needed.
					</Text>
				</Stack>
			</Screen>
			<TimerSheet isOpen={isTimerOpen} onOpenChange={setIsTimerOpen} mixer={mixer} />
			<PresetSheet isOpen={isPresetsOpen} onOpenChange={setIsPresetsOpen} mixer={mixer} />
		</>
	);
}

export default App;
