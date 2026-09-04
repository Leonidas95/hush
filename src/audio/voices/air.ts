import type { VoiceFactory } from './kit';
import { between, createRig, filter, gain, modulate, noiseSource } from './kit';

export const wind: VoiceFactory = ({ context, noise }) => {
	const rig = createRig(context, 5);

	const bed = noiseSource(rig, 'pink', noise);
	const body = filter(context, 'bandpass', 480, 1.1);
	const shelf = filter(context, 'lowpass', 2400, 0.5);
	const level = gain(context, 0.35);
	bed.connect(body).connect(shelf).connect(level).connect(rig.output);

	rig.every(2200, 6500, (at) => {
		const travel = between(1.6, 4.5);
		body.frequency.cancelScheduledValues(at);
		body.frequency.setValueAtTime(body.frequency.value, at);
		body.frequency.linearRampToValueAtTime(between(220, 1150), at + travel);

		level.gain.cancelScheduledValues(at);
		level.gain.setValueAtTime(level.gain.value, at);
		level.gain.linearRampToValueAtTime(between(0.18, 0.62), at + travel);
	});

	return rig.toVoice();
};

export const leaves: VoiceFactory = ({ context, noise }) => {
	const rig = createRig(context, 2);

	const bed = noiseSource(rig, 'white', noise);
	const body = filter(context, 'highpass', 1800);
	const voice = filter(context, 'bandpass', 3800, 0.8);
	const level = gain(context, 0.18);
	bed.connect(body).connect(voice).connect(level).connect(rig.output);

	modulate(rig, voice.frequency, { frequency: 2.4, depth: 700 });

	rig.every(1800, 5200, (at) => {
		const travel = between(0.9, 2.6);
		level.gain.cancelScheduledValues(at);
		level.gain.setValueAtTime(level.gain.value, at);
		level.gain.linearRampToValueAtTime(between(0.08, 0.4), at + travel);
	});

	return rig.toVoice();
};

export const fan: VoiceFactory = ({ context, noise }) => {
	const rig = createRig(context);

	const bed = noiseSource(rig, 'brown', noise);
	const body = filter(context, 'lowpass', 900, 0.7);
	const level = gain(context, 0.75);
	bed.connect(body).connect(level).connect(rig.output);
	modulate(rig, level.gain, { frequency: 11, depth: 0.05 });

	const hum = context.createOscillator();
	hum.type = 'sine';
	hum.frequency.value = 60;
	const humLevel = gain(context, 0.035);
	hum.connect(humLevel).connect(rig.output);
	rig.play(hum);

	return rig.toVoice();
};

const colourVoice =
	(colour: 'white' | 'pink' | 'brown', level: number, ceiling: number): VoiceFactory =>
	({ context, noise }) => {
		const rig = createRig(context);
		const bed = noiseSource(rig, colour, noise);
		const shelf = filter(context, 'lowpass', ceiling, 0.5);
		bed.connect(shelf).connect(gain(context, level)).connect(rig.output);
		return rig.toVoice();
	};

export const whiteNoise = colourVoice('white', 0.35, 12000);
export const pinkNoise = colourVoice('pink', 0.8, 14000);
export const brownNoise = colourVoice('brown', 0.8, 16000);
