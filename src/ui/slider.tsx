import { Slider as AstryxSlider } from '@astryxdesign/core/Slider';

export type SliderProps = {
	label: string;
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	isLabelHidden?: boolean;
	valueDisplay?: 'tooltip' | 'text' | 'none';
	format?: (value: number) => string;
	isDisabled?: boolean;
};

export function Slider({
	label,
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	isLabelHidden,
	valueDisplay = 'none',
	format,
	isDisabled,
}: SliderProps) {
	return (
		<AstryxSlider
			label={label}
			value={value}
			onChange={onChange as (value: number | [number, number]) => void}
			min={min}
			max={max}
			step={step}
			isLabelHidden={isLabelHidden}
			valueDisplay={valueDisplay}
			formatValue={format}
			isDisabled={isDisabled}
			width="100%"
		/>
	);
}
