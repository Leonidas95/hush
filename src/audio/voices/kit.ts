import type { NoiseBank, NoiseColour } from '../noise';

export type Voice = {
	readonly output: AudioNode;
	start: () => void;
	stop: () => void;
};

export type VoiceKit = {
	readonly context: AudioContext;
	readonly noise: NoiseBank;
};

export type VoiceFactory = (kit: VoiceKit) => Voice;

export const between = (min: number, max: number): number => min + Math.random() * (max - min);

export type Rig = {
	readonly context: AudioContext;
	readonly output: GainNode;
	readonly play: <T extends AudioScheduledSourceNode>(source: T) => T;
	readonly every: (minMs: number, maxMs: number, emit: (at: number) => void) => void;
	readonly toVoice: () => Voice;
};

export const createRig = (context: AudioContext, trim = 1): Rig => {
	const output = context.createGain();
	output.gain.value = trim;
	const sources: AudioScheduledSourceNode[] = [];
	const schedules: Array<{ minMs: number; maxMs: number; emit: (at: number) => void }> = [];
	const timers: number[] = [];
	let isRunning = false;

	const play = <T extends AudioScheduledSourceNode>(source: T): T => {
		sources.push(source);
		return source;
	};

	const every = (minMs: number, maxMs: number, emit: (at: number) => void): void => {
		schedules.push({ minMs, maxMs, emit });
	};

	const arm = (schedule: { minMs: number; maxMs: number; emit: (at: number) => void }): void => {
		if (!isRunning) return;
		const timer = window.setTimeout(
			() => {
				if (!isRunning) return;
				schedule.emit(context.currentTime + 0.02);
				arm(schedule);
			},
			between(schedule.minMs, schedule.maxMs),
		);
		timers.push(timer);
	};

	const start = (): void => {
		if (isRunning) return;
		isRunning = true;
		for (const source of sources) source.start();
		for (const schedule of schedules) arm(schedule);
	};

	const stop = (): void => {
		isRunning = false;
		for (const timer of timers) window.clearTimeout(timer);
		timers.length = 0;
		for (const source of sources) {
			try {
				source.stop();
			} catch {
			}
			source.disconnect();
		}
		output.disconnect();
	};

	return { context, output, play, every, toVoice: () => ({ output, start, stop }) };
};

export const noiseSource = (
	rig: Rig,
	colour: NoiseColour,
	bank: NoiseBank,
): AudioBufferSourceNode => {
	const source = rig.context.createBufferSource();
	source.buffer = bank[colour];
	source.loop = true;
	source.loopStart = 0;
	source.loopEnd = bank[colour].duration;
	rig.play(source);
	source.playbackRate.value = between(0.97, 1.03);
	return source;
};

export const filter = (
	context: AudioContext,
	type: BiquadFilterType,
	frequency: number,
	q = 0.7,
): BiquadFilterNode => {
	const node = context.createBiquadFilter();
	node.type = type;
	node.frequency.value = frequency;
	node.Q.value = q;
	return node;
};

export const gain = (context: AudioContext, value: number): GainNode => {
	const node = context.createGain();
	node.gain.value = value;
	return node;
};

export const modulate = (
	rig: Rig,
	target: AudioParam,
	options: { frequency: number; depth: number },
): void => {
	const oscillator = rig.context.createOscillator();
	oscillator.type = 'sine';
	oscillator.frequency.value = options.frequency;
	const depth = gain(rig.context, options.depth);
	oscillator.connect(depth).connect(target);
	rig.play(oscillator);
};

export const burst = (
	rig: Rig,
	bank: NoiseBank,
	options: {
		at: number;
		colour: NoiseColour;
		frequency: number;
		q: number;
		peak: number;
		attack: number;
		decay: number;
		destination: AudioNode;
	},
): void => {
	const { context } = rig;
	const source = context.createBufferSource();
	source.buffer = bank[options.colour];
	const band = filter(context, 'bandpass', options.frequency, options.q);
	const envelope = context.createGain();

	envelope.gain.setValueAtTime(0.0001, options.at);
	envelope.gain.exponentialRampToValueAtTime(options.peak, options.at + options.attack);
	envelope.gain.exponentialRampToValueAtTime(0.0001, options.at + options.attack + options.decay);

	source.connect(band).connect(envelope).connect(options.destination);
	source.start(options.at, between(0, bank[options.colour].duration - 0.5));
	source.stop(options.at + options.attack + options.decay + 0.05);
	source.onended = () => {
		source.disconnect();
		band.disconnect();
		envelope.disconnect();
	};
};

export const strike = (
	rig: Rig,
	options: {
		at: number;
		frequency: number;
		peak: number;
		decay: number;
		destination: AudioNode;
	},
): void => {
	const { context } = rig;
	const oscillator = context.createOscillator();
	oscillator.type = 'sine';
	oscillator.frequency.value = options.frequency;

	const envelope = context.createGain();
	envelope.gain.setValueAtTime(0.0001, options.at);
	envelope.gain.exponentialRampToValueAtTime(options.peak, options.at + 0.01);
	envelope.gain.exponentialRampToValueAtTime(0.0001, options.at + options.decay);

	oscillator.connect(envelope).connect(options.destination);
	oscillator.start(options.at);
	oscillator.stop(options.at + options.decay + 0.05);
	oscillator.onended = () => {
		oscillator.disconnect();
		envelope.disconnect();
	};
};
