import { Button as AstryxButton } from '@astryxdesign/core/Button';
import { toVariant } from './internal/adapter';
import type { Size, Tone } from './tokens';

export type ButtonProps = {
	label: string;
	tone?: Tone;
	size?: Size;
	isLoading?: boolean;
	isDisabled?: boolean;
	onPress?: () => void;
};

export function Button({
	label,
	tone = 'secondary',
	size = 'md',
	isLoading,
	isDisabled,
	onPress,
}: ButtonProps) {
	return (
		<AstryxButton
			label={label}
			variant={toVariant(tone)}
			size={size}
			isLoading={isLoading}
			isDisabled={isDisabled}
			onClick={onPress}
		/>
	);
}
