import { BottomSheet } from '@astryxdesign/core/BottomSheet';
import type { ReactNode } from 'react';

export type SheetProps = {
	label: string;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	height?: 'hug' | 'capped';
	children: ReactNode;
};

export function Sheet({ label, isOpen, onOpenChange, height = 'hug', children }: SheetProps) {
	return (
		<BottomSheet label={label} isOpen={isOpen} onOpenChange={onOpenChange} height={height}>
			{children}
		</BottomSheet>
	);
}
