import { defineSyntaxTheme, defineTheme } from '@astryxdesign/core/theme';

const hushSyntax = defineSyntaxTheme({
	name: 'xds-hush',
	tokens: {
		keyword: ['#2C5A9E', '#8FB3DC'],
		string: ['#2E6B4A', '#7BC49E'],
		comment: ['#5A6B82', '#5A6B82'],
		number: ['#8C6B30', '#D4B870'],
		function: ['#3A5E8C', '#7BA8D4'],
		type: ['#6B4A8C', '#B08ED4'],
		variable: ['#2C5A9E', '#C3D4E8'],
		operator: ['#4E5A6B', '#93A4BC'],
		constant: ['#8C6B30', '#D4B870'],
		tag: ['#8C3A3A', '#D47A7A'],
		attribute: ['#7C5E3A', '#C4A882'],
		property: ['#3A7C6B', '#70C4B0'],
		punctuation: ['#3A5E8C', '#7FA8D0'],
		background: ['#EEF3F9', '#0E141E'],
	},
});

export const hushTheme = defineTheme({
	name: 'hush',

	typography: {
		scale: { base: 16, ratio: 1.25 },
		body: {
			family: 'DM Sans',
			fallbacks:
				'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
		},
		heading: {
			family: 'DM Sans',
			fallbacks:
				'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
		},
		code: {
			family: 'JetBrains Mono',
			fallbacks: '"SF Mono", Monaco, Consolas, monospace',
		},
	},

	motion: { fast: 140, medium: 320, slow: 720, ratio: 0.8 },

	syntax: hushSyntax,

	tokens: {
		'--color-accent': ['#2C5A9E', '#8FB3DC'],
		'--color-accent-muted': ['#2C5A9E1F', '#8FB3DC29'],
		'--color-neutral': ['#2C5A9E14', '#8FB3DC1A'],
		'--color-background-body': ['#EEF3F9', '#080B12'],
		'--color-background-surface': ['#FFFFFF', '#131A26'],
		'--color-overlay': ['#0B1017A6', '#04070CD9'],
		'--color-overlay-hover': ['#2C5A9E0D', '#8FB3DC12'],
		'--color-overlay-pressed': ['#2C5A9E1A', '#8FB3DC24'],
		'--color-background-muted': ['#E4EBF4', '#0E141E'],

		'--color-text-primary': ['#101820', '#DDE6F2'],
		'--color-text-secondary': ['#4A5A6E', '#8C9CB3'],
		'--color-text-disabled': ['#9AAABC', '#4E5B6E'],
		'--color-text-accent': ['#2C5A9E', '#A6C6EA'],
		'--color-on-dark': '#FFFFFF',
		'--color-on-light': '#101820',
		'--color-on-accent': ['#FFFFFF', '#0B1017'],
		'--color-on-success': ['#FFFFFF', '#0B1017'],
		'--color-on-error': ['#FFFFFF', '#0B1017'],
		'--color-on-warning': ['#101820', '#0B1017'],

		'--color-icon-accent': ['#2C5A9E', '#8FB3DC'],
		'--color-icon-primary': ['#101820', '#DDE6F2'],
		'--color-icon-secondary': ['#4A5A6E', '#8C9CB3'],
		'--color-icon-disabled': ['#9AAABC', '#4E5B6E'],

		'--color-background-card': ['#FFFFFF', '#131A26'],
		'--color-background-popover': ['#FFFFFF', '#1A2231'],
		'--color-background-inverted': ['#101820', '#DDE6F2'],

		'--color-success': ['#2E8B4A', '#5CC183'],
		'--color-success-muted': ['#2E8B4A1F', '#5CC1832E'],
		'--color-error': ['#C42B3C', '#F0707E'],
		'--color-error-muted': ['#C42B3C1F', '#F0707E2E'],
		'--color-warning': ['#B57A00', '#E8B44A'],
		'--color-warning-muted': ['#B57A001F', '#E8B44A2E'],

		'--color-border': ['#D3DEEB', '#8FB3DC1F'],
		'--color-border-emphasized': ['#A9BDD4', '#8FB3DC42'],

		'--color-skeleton': ['#D3DEEB', '#1E2836'],
		'--color-track': ['#C6D3E3', '#28344557'],
		'--color-shadow': ['#2C5A9E1A', '#00000066'],
		'--color-tint-hover': ['black', 'white'],

		'--color-background-blue': ['#3A6EA533', '#3A78C466'],
		'--color-border-blue': ['#3A6EA5', '#6FA6E0'],
		'--color-icon-blue': ['#2C5A9E', '#A8CCF2'],
		'--color-text-blue': ['#1E3F70', '#DCEBFC'],

		'--color-background-cyan': ['#2E7C8C33', '#2E97AD66'],
		'--color-border-cyan': ['#2E7C8C', '#5FC2D6'],
		'--color-icon-cyan': ['#256676', '#A6E6F2'],
		'--color-text-cyan': ['#1B4C59', '#DAF5FB'],

		'--color-background-gray': ['#5C6A7C33', '#6E7F9666'],
		'--color-border-gray': ['#5C6A7C', '#93A4BC'],
		'--color-icon-gray': ['#4A5A6E', '#CBD6E6'],
		'--color-text-gray': ['#33404F', '#E6ECF5'],

		'--color-background-green': ['#2E8B4A33', '#35A45E66'],
		'--color-border-green': ['#2E8B4A', '#5CC183'],
		'--color-icon-green': ['#256F3B', '#A7EBC2'],
		'--color-text-green': ['#17492A', '#DCF7E6'],

		'--color-background-orange': ['#B5680033', '#D07C1466'],
		'--color-border-orange': ['#B56800', '#E8A052'],
		'--color-icon-orange': ['#96560A', '#F7CE9B'],
		'--color-text-orange': ['#6B3B04', '#FDEAD4'],

		'--color-background-pink': ['#AE3F6B33', '#C9548266'],
		'--color-border-pink': ['#AE3F6B', '#E88AAC'],
		'--color-icon-pink': ['#8E2D54', '#F6BDD2'],
		'--color-text-pink': ['#5F1834', '#FDE3EC'],

		'--color-background-purple': ['#5E44A033', '#7A5BC466'],
		'--color-border-purple': ['#5E44A0', '#A78BE4'],
		'--color-icon-purple': ['#4A3382', '#CDBCF6'],
		'--color-text-purple': ['#2F1F5C', '#EDE5FD'],

		'--color-background-red': ['#C42B3C33', '#D8455566'],
		'--color-border-red': ['#C42B3C', '#F0707E'],
		'--color-icon-red': ['#A11E2D', '#F9AEB6'],
		'--color-text-red': ['#6E1019', '#FDE2E5'],

		'--color-background-teal': ['#26786533', '#2E947C66'],
		'--color-border-teal': ['#267865', '#57BFA6'],
		'--color-icon-teal': ['#1D6152', '#9FE6D4'],
		'--color-text-teal': ['#11463A', '#D9F7EF'],

		'--color-background-yellow': ['#A5820033', '#C29B1466'],
		'--color-border-yellow': ['#A58200', '#DEBB55'],
		'--color-icon-yellow': ['#7F6400', '#F1DA9C'],
		'--color-text-yellow': ['#544200', '#FBF2D6'],

		'--spacing-0-5': '2px',
		'--spacing-1': '4px',
		'--spacing-1-5': '8px',
		'--spacing-2': '12px',
		'--spacing-3': '16px',
		'--spacing-4': '20px',
		'--spacing-5': '26px',
		'--spacing-6': '32px',
		'--spacing-7': '38px',
		'--spacing-8': '44px',
		'--spacing-9': '52px',
		'--spacing-10': '60px',
		'--spacing-11': '68px',
		'--spacing-12': '76px',

		'--radius-inner': '8px',
		'--radius-element': '12px',
		'--radius-container': '18px',
		'--radius-page': '24px',

		'--size-element-sm': '36px',
		'--size-element-md': '44px',
		'--size-element-lg': '52px',

		'--shadow-low': '0 1px 2px #00000059, 0 2px 8px #0000003D',
		'--shadow-med': '0 2px 6px #00000066, 0 8px 20px #00000047',
		'--shadow-high': '0 4px 10px #00000073, 0 16px 36px #00000052',
		'--shadow-inset-hover': 'inset 0 0 0 1px #8FB3DC3D',
		'--shadow-inset-selected': 'inset 0 0 0 1px #8FB3DC66',
		'--shadow-inset-success': 'inset 0 0 0 1px #5CC18366',
		'--shadow-inset-warning': 'inset 0 0 0 1px #E8B44A66',
		'--shadow-inset-error': 'inset 0 0 0 1px #F0707E66',
	},

	components: {
		button: {
			base: { borderRadius: 'var(--radius-full)' },
		},
		card: {
			base: {
				borderRadius: 'var(--radius-container)',
				padding: 'var(--spacing-3)',
			},
		},
		section: {
			base: { padding: 'var(--spacing-3)' },
		},
	},
});
