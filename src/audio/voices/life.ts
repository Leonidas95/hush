import type { VoiceFactory } from './kit';
import { between, burst, createRig, filter, gain, modulate, noiseSource, strike } from './kit';

export const fire: VoiceFactory = ({ context, noise }) => {
	const rig = createRig(context);

	const bed = noiseSource(rig, 'brown', noise);
	const body = filter(context, 'lowpass', 420, 0.8);
	const bedLevel = gain(context, 0.75);
	bed.connect(body).connect(bedLevel).connect(rig.output);
	modulate(rig, bedLevel.gain, { frequency: 0.35, depth: 0.18 });

	const crackles = gain(context, 0.5);
	crackles.connect(rig.output);
	rig.every(28, 190, (at) => {
		burst(rig, noise, {
			at,
			colour: 'white',
			frequency: between(1400, 6000),
			q: between(1.5, 5),
			peak: between(0.05, 0.4),
			attack: 0.0008,
			decay: between(0.004, 0.03),
			destination: crackles,
		});
	});

	return rig.toVoice();
};

export const crickets: VoiceFactory = ({ context, noise }) => {
	const rig = createRig(context, 4);

	const bed = noiseSource(rig, 'brown', noise);
	const floor = filter(context, 'lowpass', 240, 0.7);
	bed.connect(floor).connect(gain(context, 0.16)).connect(rig.output);

	const chorus = gain(context, 0.3);
	chorus.connect(rig.output);

	rig.every(320, 1400, (at) => {
		const centre = between(3900, 5400);
		const pulses = Math.floor(between(3, 7));
		const spacing = between(0.035, 0.06);
		for (let index = 0; index < pulses; index += 1) {
			burst(rig, noise, {
				at: at + index * spacing,
				colour: 'white',
				frequency: centre,
				q: 22,
				peak: between(0.12, 0.3),
				attack: 0.004,
				decay: 0.022,
				destination: chorus,
			});
		}
	});

	return rig.toVoice();
};

export const birds: VoiceFactory = ({ context, noise }) => {
	const rig = createRig(context, 6);

	const bed = noiseSource(rig, 'pink', noise);
	const distance = filter(context, 'lowpass', 1400, 0.5);
	bed.connect(distance).connect(gain(context, 0.06)).connect(rig.output);

	const song = gain(context, 0.14);
	song.connect(rig.output);

	rig.every(2600, 9000, (at) => {
		const notes = Math.floor(between(2, 6));
		const base = between(2200, 4200);
		for (let index = 0; index < notes; index += 1) {
			const start = at + index * between(0.09, 0.2);
			const length = between(0.05, 0.13);
			const from = base * between(0.9, 1.15);
			const to = from * between(1.15, 1.9);

			const chirp = context.createOscillator();
			chirp.type = 'sine';
			chirp.frequency.setValueAtTime(from, start);
			chirp.frequency.exponentialRampToValueAtTime(to, start + length * 0.6);
			chirp.frequency.exponentialRampToValueAtTime(from * 0.95, start + length);

			const envelope = context.createGain();
			envelope.gain.setValueAtTime(0.0001, start);
			envelope.gain.exponentialRampToValueAtTime(between(0.25, 0.6), start + 0.012);
			envelope.gain.exponentialRampToValueAtTime(0.0001, start + length);

			chirp.connect(envelope).connect(song);
			chirp.start(start);
			chirp.stop(start + length + 0.03);
			chirp.onended = () => {
				chirp.disconnect();
				envelope.disconnect();
			};
		}
	});

	return rig.toVoice();
};

export const cafe: VoiceFactory = ({ context, noise }) => {
	const rig = createRig(context, 3);

	const room = noiseSource(rig, 'pink', noise);
	const body = filter(context, 'bandpass', 520, 0.5);
	const shelf = filter(context, 'lowpass', 1600, 0.6);
	const level = gain(context, 0.5);
	room.connect(body).connect(shelf).connect(level).connect(rig.output);
	modulate(rig, level.gain, { frequency: 0.23, depth: 0.14 });

	const murmur = gain(context, 0.35);
	murmur.connect(rig.output);
	rig.every(420, 1800, (at) => {
		burst(rig, noise, {
			at,
			colour: 'pink',
			frequency: between(280, 900),
			q: between(1.2, 3),
			peak: between(0.08, 0.24),
			attack: between(0.05, 0.15),
			decay: between(0.2, 0.6),
			destination: murmur,
		});
	});

	const china = gain(context, 0.09);
	china.connect(rig.output);
	rig.every(2500, 11000, (at) => {
		strike(rig, {
			at,
			frequency: between(1800, 4600),
			peak: between(0.1, 0.3),
			decay: between(0.12, 0.4),
			destination: china,
		});
	});

	return rig.toVoice();
};

export const train: VoiceFactory = ({ context, noise }) => {
	const rig = createRig(context);

	const roll = noiseSource(rig, 'brown', noise);
	const body = filter(context, 'lowpass', 320, 0.9);
	const level = gain(context, 0.85);
	roll.connect(body).connect(level).connect(rig.output);
	modulate(rig, level.gain, { frequency: 0.5, depth: 0.1 });

	const clacks = gain(context, 0.35);
	clacks.connect(rig.output);
	rig.every(1500, 1750, (at) => {
		for (const offset of [0, between(0.12, 0.17)]) {
			burst(rig, noise, {
				at: at + offset,
				colour: 'brown',
				frequency: between(160, 320),
				q: 1.4,
				peak: between(0.25, 0.5),
				attack: 0.002,
				decay: between(0.05, 0.1),
				destination: clacks,
			});
		}
	});

	return rig.toVoice();
};

export const chimes: VoiceFactory = ({ context }) => {
	const rig = createRig(context, 8);
	const bell = gain(context, 0.2);
	bell.connect(rig.output);

	const scale = [523.25, 587.33, 698.46, 783.99, 880];
	const partials = [1, 2.76, 5.4];

	rig.every(3500, 11000, (at) => {
		const root = scale[Math.floor(Math.random() * scale.length)];
		const decay = between(3.5, 8);
		partials.forEach((ratio, index) => {
			strike(rig, {
				at,
				frequency: root * ratio,
				peak: between(0.18, 0.4) / (index + 1.6),
				decay: decay / (index + 1),
				destination: bell,
			});
		});
	});

	return rig.toVoice();
};
