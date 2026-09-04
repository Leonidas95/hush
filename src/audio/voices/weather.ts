import type { VoiceFactory } from './kit';
import { between, burst, createRig, filter, gain, modulate, noiseSource } from './kit';

export const rain: VoiceFactory = ({ context, noise }) => {
	const rig = createRig(context);

	const bed = noiseSource(rig, 'white', noise);
	const body = filter(context, 'highpass', 480);
	const air = filter(context, 'lowpass', 6800, 0.5);
	const bedLevel = gain(context, 0.5);
	bed.connect(body).connect(air).connect(bedLevel).connect(rig.output);

	modulate(rig, air.frequency, { frequency: 0.06, depth: 1400 });
	modulate(rig, bedLevel.gain, { frequency: 0.09, depth: 0.07 });

	const drops = gain(context, 0.5);
	drops.connect(rig.output);
	rig.every(14, 55, (at) => {
		burst(rig, noise, {
			at,
			colour: 'white',
			frequency: between(1600, 5200),
			q: between(2, 6),
			peak: between(0.02, 0.09),
			attack: 0.001,
			decay: between(0.01, 0.05),
			destination: drops,
		});
	});

	return rig.toVoice();
};

export const storm: VoiceFactory = ({ context, noise }) => {
	const rig = createRig(context);

	const bed = noiseSource(rig, 'white', noise);
	const body = filter(context, 'highpass', 260);
	const air = filter(context, 'lowpass', 4200, 0.5);
	const bedLevel = gain(context, 0.5);
	bed.connect(body).connect(air).connect(bedLevel).connect(rig.output);
	modulate(rig, air.frequency, { frequency: 0.05, depth: 1100 });

	const thunder = gain(context, 0.9);
	thunder.connect(rig.output);

	rig.every(9000, 26000, (at) => {
		const roll = context.createBufferSource();
		roll.buffer = noise.brown;
		const rumble = filter(context, 'lowpass', between(90, 190), 1.4);
		const envelope = context.createGain();

		const swell = between(0.5, 1.4);
		const tail = between(2.6, 5.5);
		envelope.gain.setValueAtTime(0.0001, at);
		envelope.gain.exponentialRampToValueAtTime(between(0.5, 1), at + swell);
		envelope.gain.exponentialRampToValueAtTime(0.0001, at + swell + tail);

		roll.connect(rumble).connect(envelope).connect(thunder);
		roll.start(at, between(0, noise.brown.duration - swell - tail - 0.1));
		roll.stop(at + swell + tail + 0.05);
		roll.onended = () => {
			roll.disconnect();
			rumble.disconnect();
			envelope.disconnect();
		};
	});

	return rig.toVoice();
};

export const waves: VoiceFactory = ({ context, noise }) => {
	const rig = createRig(context, 2.1);

	const bed = noiseSource(rig, 'brown', noise);
	const colour = filter(context, 'lowpass', 700, 0.6);
	const swell = gain(context, 0.3);
	bed.connect(colour).connect(swell).connect(rig.output);

	const spray = noiseSource(rig, 'white', noise);
	const sprayBand = filter(context, 'bandpass', 2200, 0.7);
	const sprayLevel = gain(context, 0.0001);
	spray.connect(sprayBand).connect(sprayLevel).connect(rig.output);

	rig.every(7000, 12000, (at) => {
		const rise = between(1.8, 3.2);
		const fall = between(3.5, 6);
		const peak = between(0.42, 0.66);

		swell.gain.cancelScheduledValues(at);
		swell.gain.setValueAtTime(Math.max(swell.gain.value, 0.0001), at);
		swell.gain.exponentialRampToValueAtTime(peak, at + rise);
		swell.gain.exponentialRampToValueAtTime(0.26, at + rise + fall);

		colour.frequency.cancelScheduledValues(at);
		colour.frequency.setValueAtTime(colour.frequency.value, at);
		colour.frequency.linearRampToValueAtTime(between(1400, 2400), at + rise);
		colour.frequency.linearRampToValueAtTime(520, at + rise + fall);

		sprayLevel.gain.cancelScheduledValues(at);
		sprayLevel.gain.setValueAtTime(Math.max(sprayLevel.gain.value, 0.0001), at);
		sprayLevel.gain.exponentialRampToValueAtTime(peak * 0.25, at + rise);
		sprayLevel.gain.exponentialRampToValueAtTime(0.0001, at + rise + fall * 0.7);
	});

	return rig.toVoice();
};

export const stream: VoiceFactory = ({ context, noise }) => {
	const rig = createRig(context);

	const bed = noiseSource(rig, 'white', noise);
	const body = filter(context, 'highpass', 900);
	const voice = filter(context, 'bandpass', 2600, 0.6);
	const level = gain(context, 0.55);
	bed.connect(body).connect(voice).connect(level).connect(rig.output);

	modulate(rig, voice.frequency, { frequency: 0.7, depth: 900 });
	modulate(rig, level.gain, { frequency: 1.3, depth: 0.06 });

	const bubbles = gain(context, 0.16);
	bubbles.connect(rig.output);
	rig.every(180, 950, (at) => {
		const bubble = context.createOscillator();
		bubble.type = 'sine';
		const from = between(320, 620);
		bubble.frequency.setValueAtTime(from, at);
		bubble.frequency.exponentialRampToValueAtTime(from * between(1.6, 2.6), at + 0.07);

		const envelope = context.createGain();
		envelope.gain.setValueAtTime(0.0001, at);
		envelope.gain.exponentialRampToValueAtTime(between(0.15, 0.4), at + 0.008);
		envelope.gain.exponentialRampToValueAtTime(0.0001, at + 0.08);

		bubble.connect(envelope).connect(bubbles);
		bubble.start(at);
		bubble.stop(at + 0.1);
		bubble.onended = () => {
			bubble.disconnect();
			envelope.disconnect();
		};
	});

	return rig.toVoice();
};
