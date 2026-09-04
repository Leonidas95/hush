import type { Levels } from '../audio/engine';
import { isSoundId, type SoundId } from '../sounds/catalog';

export type Preset = {
	readonly id: string;
	readonly name: string;
	readonly levels: Levels;
};

export const PRESETS: readonly Preset[] = [
	{ id: 'rainy-window', name: 'Rainy window', levels: { rain: 65, storm: 22, wind: 18 } },
	{ id: 'open-ocean', name: 'Open ocean', levels: { waves: 72, wind: 28, birds: 8 } },
	{ id: 'campfire', name: 'Campfire', levels: { fire: 62, crickets: 34, leaves: 18 } },
	{ id: 'deep-focus', name: 'Deep focus', levels: { brown: 55, fan: 28 } },
	{ id: 'forest-morning', name: 'Forest morning', levels: { birds: 42, leaves: 36, stream: 30 } },
	{ id: 'night-train', name: 'Night train', levels: { train: 58, rain: 30 } },
	{ id: 'monastery', name: 'Monastery', levels: { chimes: 45, wind: 22, leaves: 15 } },
	{ id: 'corner-table', name: 'Corner table', levels: { cafe: 58, rain: 26 } },
];

export const compactLevels = (levels: Levels): Levels =>
	Object.fromEntries(
		(Object.entries(levels) as Array<[SoundId, number]>).filter(([, level]) => level > 0),
	);

export const isSilent = (levels: Levels): boolean =>
	Object.keys(compactLevels(levels)).length === 0;

export const encodeMix = (levels: Levels): string =>
	(Object.entries(compactLevels(levels)) as Array<[SoundId, number]>)
		.map(([id, level]) => `${id}.${Math.round(level)}`)
		.join('_');

export const decodeMix = (encoded: string): Levels => {
	const levels: Record<string, number> = {};
	for (const part of encoded.split('_')) {
		const [id, raw] = part.split('.');
		const level = Number(raw);
		if (!id || !isSoundId(id) || !Number.isFinite(level)) continue;
		levels[id] = Math.min(Math.max(Math.round(level), 0), 100);
	}
	return levels as Levels;
};

const SHARE_KEY = 'mix';

export const readSharedMix = (): Levels | null => {
	const hash = window.location.hash.replace(/^#/, '');
	if (!hash) return null;
	const encoded = new URLSearchParams(hash).get(SHARE_KEY);
	if (!encoded) return null;
	const levels = decodeMix(encoded);
	return isSilent(levels) ? null : levels;
};

export const shareUrl = (levels: Levels): string => {
	const { origin, pathname } = window.location;
	return `${origin}${pathname}#${SHARE_KEY}=${encodeMix(levels)}`;
};

const STORAGE_KEY = 'hush.mix.v1';

export type StoredMix = {
	readonly levels: Levels;
	readonly master: number;
};

export const loadStoredMix = (): StoredMix | null => {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed: unknown = JSON.parse(raw);
		if (typeof parsed !== 'object' || parsed === null) return null;
		const { levels, master } = parsed as Partial<StoredMix>;
		if (typeof levels !== 'object' || levels === null) return null;
		return {
			levels: decodeMix(encodeMix(levels)),
			master: typeof master === 'number' ? master : 70,
		};
	} catch {
		return null;
	}
};

export const saveStoredMix = (mix: StoredMix): void => {
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mix));
	} catch {
	}
};
