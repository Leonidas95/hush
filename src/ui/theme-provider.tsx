import type { DefinedTheme } from '@astryxdesign/core/theme';
import { Theme } from '@astryxdesign/core/theme';
import type { ReactNode } from 'react';
import { hushTheme } from './themes/hush/hush.js';
import { hushIconRegistry } from './themes/hush/icons';

const theme: DefinedTheme = { ...hushTheme, icons: hushIconRegistry };

export type ColorMode = 'system' | 'light' | 'dark';

export type UIProviderProps = {
	mode?: ColorMode;
	children: ReactNode;
};

export function UIProvider({ mode = 'system', children }: UIProviderProps) {
	return (
		<Theme theme={theme} mode={mode}>
			{children}
		</Theme>
	);
}
