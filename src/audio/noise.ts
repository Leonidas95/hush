const BUFFER_SECONDS = 8;
const SEAM_SECONDS = 0.25;

export type NoiseColour = 'white' | 'pink' | 'brown';

export type NoiseBank = Readonly<Record<NoiseColour, AudioBuffer>>;

type Fill = (samples: Float32Array) => void;

const fillWhite: Fill = (samples) => {
	for (let i = 0; i < samples.length; i += 1) {
		samples[i] = Math.random() * 2 - 1;
	}
};

const fillPink: Fill = (samples) => {
	let b0 = 0;
	let b1 = 0;
	let b2 = 0;
	let b3 = 0;
	let b4 = 0;
	let b5 = 0;
	let b6 = 0;

	for (let i = 0; i < samples.length; i += 1) {
		const white = Math.random() * 2 - 1;
		b0 = 0.99886 * b0 + white * 0.0555179;
		b1 = 0.99332 * b1 + white * 0.0750759;
		b2 = 0.969 * b2 + white * 0.153852;
		b3 = 0.8665 * b3 + white * 0.3104856;
		b4 = 0.55 * b4 + white * 0.5329522;
		b5 = -0.7616 * b5 - white * 0.016898;
		samples[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
		b6 = white * 0.115926;
	}
};

const fillBrown: Fill = (samples) => {
	let last = 0;
	for (let i = 0; i < samples.length; i += 1) {
		const white = Math.random() * 2 - 1;
		last = (last + 0.02 * white) / 1.02;
		samples[i] = last * 3.5;
	}
};

const FILLS: Record<NoiseColour, Fill> = {
	white: fillWhite,
	pink: fillPink,
	brown: fillBrown,
};

const createNoiseBuffer = (context: BaseAudioContext, colour: NoiseColour): AudioBuffer => {
	const { sampleRate } = context;
	const length = Math.floor(BUFFER_SECONDS * sampleRate);
	const seam = Math.floor(SEAM_SECONDS * sampleRate);

	const source = new Float32Array(length + seam);
	FILLS[colour](source);

	const buffer = context.createBuffer(1, length, sampleRate);
	const output = buffer.getChannelData(0);
	output.set(source.subarray(0, length));

	for (let i = 0; i < seam; i += 1) {
		const progress = i / seam;
		output[i] = source[i] * Math.sqrt(progress) + source[length + i] * Math.sqrt(1 - progress);
	}

	return buffer;
};

export const createNoiseBank = (context: BaseAudioContext): NoiseBank => ({
	white: createNoiseBuffer(context, 'white'),
	pink: createNoiseBuffer(context, 'pink'),
	brown: createNoiseBuffer(context, 'brown'),
});
