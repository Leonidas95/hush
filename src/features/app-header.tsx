import { Button, IconButton, Row, Title } from '../ui/index';
import { useCallback, useState } from 'react';
import { isSilent, shareUrl } from '../state/mix';
import type { Mixer } from '../state/useMixer';

const COPIED_MS = 2000;

export type AppHeaderProps = {
	mixer: Mixer;
	onOpenTimer: () => void;
	onOpenPresets: () => void;
};

export function AppHeader({ mixer, onOpenTimer, onOpenPresets }: AppHeaderProps) {
	const [hasCopied, setHasCopied] = useState(false);
	const isEmpty = isSilent(mixer.levels);

	const share = useCallback(() => {
		const url = shareUrl(mixer.levels);
		void navigator.clipboard.writeText(url).then(
			() => {
				setHasCopied(true);
				window.setTimeout(() => setHasCopied(false), COPIED_MS);
			},
			() => {
				window.location.hash = url.slice(url.indexOf('#') + 1);
			},
		);
	}, [mixer.levels]);

	return (
		<Row distribute="between" align="center" padding="xs">
			<Title level={1}>Hush</Title>
			<Row gap="xs" align="center">
				<Button label="Blends" tone="quiet" size="sm" onPress={onOpenPresets} />
				<IconButton
					label="Sleep timer"
					glyph="timer"
					tone={mixer.sleepRemaining !== null ? 'primary' : 'quiet'}
					onPress={onOpenTimer}
				/>
				<IconButton
					label={hasCopied ? 'Link copied' : 'Copy link to this mix'}
					glyph={hasCopied ? 'check' : 'link'}
					isDisabled={isEmpty}
					onPress={share}
				/>
				<IconButton
					label="Clear the mix"
					glyph="reset"
					isDisabled={isEmpty}
					onPress={mixer.clear}
				/>
			</Row>
		</Row>
	);
}
