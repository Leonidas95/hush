import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AudioEngine, type Levels } from '../audio/engine';
import type { SoundId } from '../sounds/catalog';
import { compactLevels, isSilent, loadStoredMix, readSharedMix, saveStoredMix } from './mix';

const DEFAULT_LEVEL = 60;
const SLEEP_FADE_SECONDS = 30;

let sharedEngine: AudioEngine | null = null;
const getEngine = (): AudioEngine => {
	sharedEngine ??= new AudioEngine();
	return sharedEngine;
};

export type Mixer = {
	readonly levels: Levels;
	readonly master: number;
	readonly isPlaying: boolean;
	readonly sleepRemaining: number | null;
	readonly levelOf: (id: SoundId) => number;
	readonly setLevel: (id: SoundId, level: number) => void;
	readonly toggle: (id: SoundId) => void;
	readonly setMaster: (level: number) => void;
	readonly setPlaying: (isPlaying: boolean) => void;
	readonly togglePlaying: () => void;
	readonly loadMix: (levels: Levels) => void;
	readonly clear: () => void;
	readonly setSleepMinutes: (minutes: number | null) => void;
};

export const useMixer = (): Mixer => {
	const stored = useMemo(() => loadStoredMix(), []);
	const [levels, setLevels] = useState<Levels>(() => readSharedMix() ?? stored?.levels ?? {});

	const lastHeardRef = useRef<Levels>({ ...levels });
	const [master, setMasterState] = useState<number>(() => stored?.master ?? 70);
	const [isPlaying, setIsPlayingState] = useState(false);
	const [sleepEndsAt, setSleepEndsAt] = useState<number | null>(null);
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		getEngine().setMix(levels);
		saveStoredMix({ levels: compactLevels(levels), master });
	}, [levels, master]);

	useEffect(() => {
		getEngine().setMasterLevel(master);
	}, [master]);

	const setPlaying = useCallback((next: boolean) => {
		setIsPlayingState(next);
		void getEngine().setPlaying(next);
		if (!next) setSleepEndsAt(null);
	}, []);

	const setLevel = useCallback(
		(id: SoundId, level: number) => {
			setLevels((current) => ({ ...current, [id]: level }));
			if (level > 0) {
				lastHeardRef.current[id] = level;
				if (!isPlaying) setPlaying(true);
			}
		},
		[isPlaying, setPlaying],
	);

	const toggle = useCallback(
		(id: SoundId) => {
			const current = levels[id] ?? 0;
			if (current > 0) {
				lastHeardRef.current[id] = current;
				setLevels((mix) => ({ ...mix, [id]: 0 }));
				return;
			}
			setLevels((mix) => ({ ...mix, [id]: lastHeardRef.current[id] || DEFAULT_LEVEL }));
			if (!isPlaying) setPlaying(true);
		},
		[levels, isPlaying, setPlaying],
	);

	const loadMix = useCallback(
		(next: Levels) => {
			lastHeardRef.current = { ...lastHeardRef.current, ...compactLevels(next) };
			setLevels(next);
			if (!isSilent(next)) setPlaying(true);
		},
		[setPlaying],
	);

	const clear = useCallback(() => {
		setLevels({});
		setPlaying(false);
	}, [setPlaying]);

	const togglePlaying = useCallback(() => setPlaying(!isPlaying), [isPlaying, setPlaying]);

	const setSleepMinutes = useCallback((minutes: number | null) => {
		setSleepEndsAt(minutes === null ? null : Date.now() + minutes * 60_000);
	}, []);

	useEffect(() => {
		if (sleepEndsAt === null) return;
		const id = window.setInterval(() => setNow(Date.now()), 1000);
		return () => window.clearInterval(id);
	}, [sleepEndsAt]);

	const fadeStartedRef = useRef(false);
	useEffect(() => {
		if (sleepEndsAt === null) {
			fadeStartedRef.current = false;
			return;
		}
		const remaining = (sleepEndsAt - now) / 1000;
		if (remaining > SLEEP_FADE_SECONDS || fadeStartedRef.current) return;

		fadeStartedRef.current = true;
		void getEngine()
			.fadeOutAndStop(Math.max(remaining, 1))
			.then(() => {
				setIsPlayingState(false);
				setSleepEndsAt(null);
			});
	}, [sleepEndsAt, now]);

	useEffect(() => {
		if (!('mediaSession' in navigator)) return;
		navigator.mediaSession.metadata = new MediaMetadata({
			title: 'Hush',
			artist: isSilent(levels) ? 'Nothing playing' : 'Ambient mix',
		});
		navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
		navigator.mediaSession.setActionHandler('play', () => setPlaying(true));
		navigator.mediaSession.setActionHandler('pause', () => setPlaying(false));
		return () => {
			navigator.mediaSession.setActionHandler('play', null);
			navigator.mediaSession.setActionHandler('pause', null);
		};
	}, [isPlaying, levels, setPlaying]);

	const levelOf = useCallback((id: SoundId) => levels[id] ?? 0, [levels]);

	const sleepRemaining =
		sleepEndsAt === null ? null : Math.max(0, Math.round((sleepEndsAt - now) / 1000));

	return {
		levels,
		master,
		isPlaying,
		sleepRemaining,
		levelOf,
		setLevel,
		toggle,
		setMaster: setMasterState,
		setPlaying,
		togglePlaying,
		loadMix,
		clear,
		setSleepMinutes,
	};
};
