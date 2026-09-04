import type { Accent, Glyph } from '../ui/index';
import { brownNoise, fan, leaves, pinkNoise, whiteNoise, wind } from '../audio/voices/air';
import type { VoiceFactory } from '../audio/voices/kit';
import { birds, cafe, chimes, crickets, fire, train } from '../audio/voices/life';
import { rain, storm, stream, waves } from '../audio/voices/weather';

export type SoundId =
	| 'rain'
	| 'storm'
	| 'waves'
	| 'stream'
	| 'wind'
	| 'leaves'
	| 'fire'
	| 'crickets'
	| 'birds'
	| 'cafe'
	| 'train'
	| 'chimes'
	| 'fan'
	| 'white'
	| 'pink'
	| 'brown';

export type Sound = {
	readonly id: SoundId;
	readonly name: string;
	readonly glyph: Glyph;
	readonly accent: Accent;
	readonly create: VoiceFactory;
};

export const SOUNDS: readonly Sound[] = [
	{ id: 'rain', name: 'Rain', glyph: 'rain', accent: 'blue', create: rain },
	{ id: 'storm', name: 'Thunder', glyph: 'storm', accent: 'purple', create: storm },
	{ id: 'waves', name: 'Waves', glyph: 'waves', accent: 'cyan', create: waves },
	{ id: 'stream', name: 'Stream', glyph: 'stream', accent: 'teal', create: stream },
	{ id: 'wind', name: 'Wind', glyph: 'wind', accent: 'gray', create: wind },
	{ id: 'leaves', name: 'Leaves', glyph: 'leaves', accent: 'green', create: leaves },
	{ id: 'fire', name: 'Fire', glyph: 'fire', accent: 'orange', create: fire },
	{ id: 'crickets', name: 'Crickets', glyph: 'night', accent: 'green', create: crickets },
	{ id: 'birds', name: 'Birds', glyph: 'birds', accent: 'yellow', create: birds },
	{ id: 'cafe', name: 'Café', glyph: 'cafe', accent: 'orange', create: cafe },
	{ id: 'train', name: 'Train', glyph: 'train', accent: 'gray', create: train },
	{ id: 'chimes', name: 'Chimes', glyph: 'chimes', accent: 'pink', create: chimes },
	{ id: 'fan', name: 'Fan', glyph: 'fan', accent: 'gray', create: fan },
	{ id: 'white', name: 'White noise', glyph: 'noise', accent: 'gray', create: whiteNoise },
	{ id: 'pink', name: 'Pink noise', glyph: 'noise', accent: 'pink', create: pinkNoise },
	{ id: 'brown', name: 'Brown noise', glyph: 'noise', accent: 'orange', create: brownNoise },
];

const BY_ID = new Map<SoundId, Sound>(SOUNDS.map((sound) => [sound.id, sound]));

export const findSound = (id: SoundId): Sound | undefined => BY_ID.get(id);

export const isSoundId = (value: string): value is SoundId => BY_ID.has(value as SoundId);
