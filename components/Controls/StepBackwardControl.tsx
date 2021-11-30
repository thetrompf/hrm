/** @jsxImportSource @emotion/react */
import { SceneState } from '@app/components/Scene';
import { css } from '@emotion/react';
import React, { Dispatch, useCallback } from 'react';

export type StepBackwardControlAction = {
	type: 'CONTROL_STEP_BACKWARD';
};

export function stepBackwardControlReducer(state: SceneState, action: StepBackwardControlAction): SceneState {
	switch (action.type) {
		case 'CONTROL_STEP_BACKWARD': {
			const previousGameIndex = state.currentGameIndex - 1;
			const previousGameState = state.gameStates[previousGameIndex];
			if (previousGameState == null) {
				return state;
			}

			return {
				...state,
				currentGame: previousGameState,
				currentGameIndex: previousGameIndex,
			};
		}
	}
}

interface StepBackwardControlProps {
	currentGameIndex: number;
	dispatch: Dispatch<StepBackwardControlAction>;
}

const style = css`
	&[disabled],
	&:disabled {
		background-color: gray;
		border-color: #404040;
	}
	&:active:not(:disabled) {
		box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
		transform: translate(1px, 1px);
	}
	&:focus {
		outline: none;
	}
	align-items: center;
	box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
	background: #788e4a;
	border: 3px solid #3c4725;
	border-radius: 5px;
	cursor: pointer;
	display: flex;
	gap: 15%;
	height: 70px;
	justify-content: center;
	width: 70px;
`;

const symbolStyle = css`
	border-bottom: 10px solid transparent;
	border-right: 40px solid rgba(0, 0, 0, 0.5);
	border-top: 10px solid transparent;
	width: 0;
	height: 0;
`;

export const StepBackwardControl = (props: StepBackwardControlProps) => {
	const { currentGameIndex, dispatch } = props;
	const disabled = currentGameIndex === 0;

	const onClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			dispatch({ type: 'CONTROL_STEP_BACKWARD' });
		},
		[dispatch],
	);

	return (
		<button disabled={disabled} onClick={onClick} css={style}>
			<div css={symbolStyle} />
		</button>
	);
};
