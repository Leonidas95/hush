import { findSound, type SoundId } from '../sounds/catalog';
import { createNoiseBank, type NoiseBank } from './noise';
import type { Voice } from './voices/kit';

const RAMP_SECONDS = 0.18;
const RELEASE_MS = 400;

export type Levels = Partial<Record<SoundId, number>>;

type Channel = {
	readonly voice: Voice;
	readonly gain: GainNode;
	release: number | null;
};

const toGain = (level: number): number => {
	const fraction = Math.min(Math.max(level, 0), 100) / 100;
	return fraction * fraction;
};

export class AudioEngine {
	private context: AudioContext | null = null;
	private master: GainNode | null = null;
	private noise: NoiseBank | null = null;
	private readonly channels = new Map<SoundId, Channel>();
	private levels: Levels = {};
	private masterLevel = 70;
	private isPlaying = false;

	private ensureContext(): { context: AudioContext; master: GainNode; noise: NoiseBank } {
		if (this.context && this.master && this.noise) {
			return { context: this.context, master: this.master, noise: this.noise };
		}

		const context = new AudioContext();
		const master = context.createGain();
		master.gain.value = 0;

		const limiter = context.createDynamicsCompressor();
		limiter.threshold.value = -6;
		limiter.knee.value = 0;
		limiter.ratio.value = 20;
		limiter.attack.value = 0.003;
		limiter.release.value = 0.25;
		master.connect(limiter).connect(context.destination);

		this.context = context;
		this.master = master;
		this.noise = createNoiseBank(context);
		return { context, master, noise: this.noise };
	}

	private rampTo(param: AudioParam, value: number, seconds = RAMP_SECONDS): void {
		const context = this.context;
		if (!context) return;
		const now = context.currentTime;
		param.cancelScheduledValues(now);
		param.setValueAtTime(param.value, now);
		param.linearRampToValueAtTime(value, now + seconds);
	}

	private openChannel(id: SoundId): Channel | null {
		const existing = this.channels.get(id);
		if (existing) {
			if (existing.release !== null) {
				window.clearTimeout(existing.release);
				existing.release = null;
			}
			return existing;
		}

		const sound = findSound(id);
		if (!sound) return null;

		const { context, master, noise } = this.ensureContext();
		const voice = sound.create({ context, noise });
		const gain = context.createGain();
		gain.gain.value = 0;
		voice.output.connect(gain).connect(master);
		voice.start();

		const channel: Channel = { voice, gain, release: null };
		this.channels.set(id, channel);
		return channel;
	}

	private closeChannel(id: SoundId): void {
		const channel = this.channels.get(id);
		if (!channel || channel.release !== null) return;

		this.rampTo(channel.gain.gain, 0);
		channel.release = window.setTimeout(() => {
			channel.voice.stop();
			channel.gain.disconnect();
			this.channels.delete(id);
		}, RELEASE_MS);
	}

	setLevel(id: SoundId, level: number): void {
		this.levels = { ...this.levels, [id]: level };
		if (!this.isPlaying) return;

		if (level <= 0) {
			this.closeChannel(id);
			return;
		}
		const channel = this.openChannel(id);
		if (channel) this.rampTo(channel.gain.gain, toGain(level));
	}

	setMix(levels: Levels): void {
		const ids = new Set<SoundId>([
			...(Object.keys(this.levels) as SoundId[]),
			...(Object.keys(levels) as SoundId[]),
		]);
		this.levels = { ...levels };
		if (!this.isPlaying) return;

		for (const id of ids) {
			const level = levels[id] ?? 0;
			if (level <= 0) {
				this.closeChannel(id);
				continue;
			}
			const channel = this.openChannel(id);
			if (channel) this.rampTo(channel.gain.gain, toGain(level));
		}
	}

	setMasterLevel(level: number): void {
		this.masterLevel = level;
		if (this.master && this.isPlaying) this.rampTo(this.master.gain, toGain(level));
	}

	async setPlaying(isPlaying: boolean): Promise<void> {
		if (isPlaying === this.isPlaying) return;
		this.isPlaying = isPlaying;

		if (!isPlaying) {
			if (this.master) this.rampTo(this.master.gain, 0);
			const context = this.context;
			window.setTimeout(
				() => {
					if (!this.isPlaying) void context?.suspend();
				},
				RAMP_SECONDS * 1000 + 40,
			);
			return;
		}

		const { context, master } = this.ensureContext();
		if (context.state !== 'running') await context.resume();

		for (const [id, level] of Object.entries(this.levels) as Array<[SoundId, number]>) {
			if (level <= 0) continue;
			const channel = this.openChannel(id);
			if (channel) this.rampTo(channel.gain.gain, toGain(level));
		}
		this.rampTo(master.gain, toGain(this.masterLevel));
	}

	async fadeOutAndStop(seconds: number): Promise<void> {
		if (this.master) this.rampTo(this.master.gain, 0, seconds);
		await new Promise((resolve) => window.setTimeout(resolve, seconds * 1000));
		await this.setPlaying(false);
	}

	async dispose(): Promise<void> {
		for (const [id] of this.channels) this.closeChannel(id);
		this.channels.clear();
		await this.context?.close();
		this.context = null;
		this.master = null;
		this.noise = null;
	}
}
