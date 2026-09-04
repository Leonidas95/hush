import {
	AudioWaveform,
	Bird,
	Bug,
	Check,
	ChevronDown,
	Clock,
	CloudLightning,
	CloudRain,
	Coffee,
	Disc3,
	Fan,
	Flame,
	Link,
	Moon,
	Pause,
	Play,
	Plus,
	RotateCcw,
	Shuffle,
	Sparkles,
	Sun,
	Timer,
	TrainFront,
	Trash2,
	Trees,
	Volume2,
	VolumeX,
	Waves,
	Wind,
	X,
} from 'lucide-react';
import type { ComponentType } from 'react';

export type Glyph =
	| 'rain'
	| 'storm'
	| 'waves'
	| 'wind'
	| 'fire'
	| 'stream'
	| 'night'
	| 'birds'
	| 'cafe'
	| 'train'
	| 'chimes'
	| 'noise'
	| 'fan'
	| 'leaves'
	| 'play'
	| 'pause'
	| 'timer'
	| 'clock'
	| 'shuffle'
	| 'reset'
	| 'sparkle'
	| 'volume'
	| 'mute'
	| 'link'
	| 'add'
	| 'remove'
	| 'check'
	| 'close'
	| 'expand'
	| 'light'
	| 'dark';

type GlyphComponent = ComponentType<any>;

const GLYPHS: Record<Glyph, GlyphComponent> = {
	rain: CloudRain,
	storm: CloudLightning,
	waves: Waves,
	wind: Wind,
	fire: Flame,
	stream: AudioWaveform,
	night: Bug,
	birds: Bird,
	cafe: Coffee,
	train: TrainFront,
	chimes: Disc3,
	noise: Disc3,
	fan: Fan,
	leaves: Trees,

	play: Play,
	pause: Pause,
	timer: Timer,
	clock: Clock,
	shuffle: Shuffle,
	reset: RotateCcw,
	sparkle: Sparkles,
	volume: Volume2,
	mute: VolumeX,
	link: Link,
	add: Plus,
	remove: Trash2,
	check: Check,
	close: X,
	expand: ChevronDown,
	light: Sun,
	dark: Moon,
};

export const toGlyphComponent = (glyph: Glyph): GlyphComponent => GLYPHS[glyph];

export const toGlyphElement = (glyph: Glyph) => {
	const Component = GLYPHS[glyph];
	return <Component width="1em" height="1em" aria-hidden />;
};
