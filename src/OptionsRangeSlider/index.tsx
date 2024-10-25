import { useState } from "react";
import { Form } from "react-bootstrap";
import { Options } from "../App";

type OptionsRangeSliderProps = {
	options: Options;
	onUpdateOptions: (optionName: string, newValue: any) => void;
	optionName: string;
	defaultValue: number;
	minValue: number;
	maxValue: number;
	textBeforeNumber: string;
	textAfterNumber: string;
};

export function OptionsRangeSlider({
	options,
	onUpdateOptions,
	optionName,
	defaultValue,
	minValue,
	maxValue,
	textBeforeNumber,
	textAfterNumber,
}: OptionsRangeSliderProps) {
	const optionValueInitial =
		options[optionName] === undefined ? defaultValue : options[optionName];
	const [optionValueControl, setOptionValueControl] =
		useState(optionValueInitial); //this is used to control the range slider

	function handleRangeSlideEnd() {
		if (options[optionName] !== optionValueControl) {
			onUpdateOptions(optionName, optionValueControl);
		} else {
			return;
		}
	}

	return (
		<Form>
			<Form.Label>
				{textBeforeNumber}
				<strong>{optionValueControl}</strong>
				{textAfterNumber}
			</Form.Label>
			<Form.Range
				min={minValue}
				max={maxValue}
				value={optionValueControl}
				onChange={(e) => {
					setOptionValueControl(e.target.valueAsNumber); //use valueAsNumber instead of value, otherwise it will return string type
				}}
				//The following events are for tracking when the user has finished sliding the range slider,
				//this approach reduces the frequency that the locally-stored options get updated (which could also be useful when the app needs to communicate with the server whenever options are updated)
				onMouseUp={() => {
					handleRangeSlideEnd();
				}} //for mouse drag
				onKeyUp={() => {
					handleRangeSlideEnd();
				}} //for keyboard arrow keys
				onTouchEnd={() => {
					handleRangeSlideEnd();
				}} //for touch devices
				onBlur={() => {
					handleRangeSlideEnd();
				}} //catch the situation(s) when user slided the range slider in an unknown way that doesn't trigger any of the events above
			/>
		</Form>
	);
}
