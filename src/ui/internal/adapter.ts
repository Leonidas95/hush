import type { Space, Tone } from '../tokens';

type AstryxStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10;

const SPACE: Record<Space, AstryxStep> = {
	none: 0,
	xs: 1,
	sm: 2,
	md: 3,
	lg: 4,
	xl: 6,
	'2xl': 10,
};

export const toStep = (space: Space | undefined): AstryxStep | undefined =>
	space === undefined ? undefined : SPACE[space];

const TONE: Record<Tone, 'primary' | 'secondary' | 'ghost' | 'destructive'> = {
	primary: 'primary',
	secondary: 'secondary',
	quiet: 'ghost',
	danger: 'destructive',
};

export const toVariant = (tone: Tone): 'primary' | 'secondary' | 'ghost' | 'destructive' =>
	TONE[tone];
