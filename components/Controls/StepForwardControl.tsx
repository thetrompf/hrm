/** @jsxImportSource @emotion/react */
import { ControlState, ProgramState, runCurrentInstruction, SceneState } from '@app/components/Scene';
import { css } from '@emotion/react';
import React, { Dispatch, useCallback } from 'react';

export type StepForwardControlAction = {
	type: 'CONTROL_STEP_FORWARD';
};

export function stepForwardControlReducer(state: SceneState, action: StepForwardControlAction): SceneState {
	switch (action.type) {
		case 'CONTROL_STEP_FORWARD': {
			const nextGameStateIndex = state.currentGameIndex + 1;
			const nextGameState = state.gameStates[nextGameStateIndex];
			if (nextGameState == null) {
				return state.control.state === ProgramState.Pending
					? {
							...state,
							control: {
								...state.control,
								state: ProgramState.Paused,
							},
					  }
					: runCurrentInstruction(state);
			} else {
				return {
					...state,
					currentGameIndex: nextGameStateIndex,
					currentGame: nextGameState,
				};
			}
		}
	}
}

interface StepForwardControlProps {
	currentGameIndex: number;
	dispatch: Dispatch<StepForwardControlAction>;
	gameState: ControlState['state'];
	maxGameIndex: number;
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
	border-left: 40px solid rgba(0, 0, 0, 0.5);
	border-top: 10px solid transparent;
	width: 0;
	height: 0;
`;

export const StepForwardControl = (props: StepForwardControlProps) => {
	const { currentGameIndex, dispatch, gameState, maxGameIndex } = props;
	const canGenerateNewState =
		gameState === ProgramState.Paused || gameState === ProgramState.Pending || gameState === ProgramState.Running;

	const disabled = currentGameIndex === maxGameIndex && !canGenerateNewState;

	const onClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			dispatch({ type: 'CONTROL_STEP_FORWARD' });
		},
		[dispatch],
	);

	return (
		<button disabled={disabled} onClick={onClick} css={style}>
			<div css={symbolStyle} />
		</button>
	);
};
