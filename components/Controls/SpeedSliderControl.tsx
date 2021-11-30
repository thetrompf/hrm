/** @jsxImportSource @emotion/react */
import { GameSpeed, ControlState } from '@app/components/Scene';
import React, { Dispatch, useCallback } from 'react';
import { css, jsx } from '@emotion/react';

export type SpeedSliderControlAction = {
	type: 'CONTROL_SPEED_SLIDER';
	payload: {
		speed: GameSpeed;
	};
};

const labelStyle = css`
	display: inline-flex;
	width: 250px;
	height: 70px;
`;
const sliderStyle = css`
	& {
		-webkit-appearance: none;
		background: transparent;
		width: 100%;
		position: relative;
	}
	&:focus {
		outline: none;
	}
	&::-webkit-slider-runnable-track {
		width: 100%;
		height: 13px;
		cursor: pointer;
		box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.7), 0px 0px 0px #0d0d0d;
		background: black;
		border-radius: 25px;
		border: 0px solid #000101;
	}
	&:focus::-webkit-slider-runnable-track {
		background: black;
	}
	&::-webkit-slider-thumb {
		box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7), 0px 0px 0px #0d0d0d;
		border: 0px solid #000000;
		height: 55px;
		width: 30px;
		border-radius: 5px;
		background: #788e4a;
		cursor: pointer;
	}
	&::-webkit-slider-thumb {
		-webkit-appearance: none;
		margin-top: -21px;
	}
`;

export function speedSliderControlReducer(state: ControlState, action: SpeedSliderControlAction): ControlState {
	switch (action.type) {
		case 'CONTROL_SPEED_SLIDER':
			return {
				...state,
				speed: action.payload.speed,
			};
	}
}

interface SpeedSliderControlProps {
	dispatch: Dispatch<SpeedSliderControlAction>;
	speed: GameSpeed;
}

export const SpeedSliderControl = (props: SpeedSliderControlProps) => {
	const { dispatch, speed } = props;

	const onChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			e.stopPropagation();
			const value = e.currentTarget.valueAsNumber as GameSpeed;
			dispatch({
				type: 'CONTROL_SPEED_SLIDER',
				payload: {
					speed: value,
				},
			});
		},
		[dispatch],
	);

	return (
		<label css={labelStyle}>
			<input
				css={sliderStyle}
				type="range"
				min={1}
				max={10}
				onChange={onChange}
				step={1}
				title="Controls the speed of automatic step / play mode"
				value={speed}
			/>
		</label>
	);
};
