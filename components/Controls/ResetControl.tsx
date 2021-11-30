/** @jsxImportSource @emotion/react */
import { ProgramState, SceneState } from '@app/components/Scene';
import { css } from '@emotion/react';
import { invariant } from 'lib/util';
import React, { Dispatch, useCallback } from 'react';

export type ResetControlAction = { type: 'CONTROL_RESET' };

export function resetControlReducer(state: SceneState, action: ResetControlAction): SceneState {
	switch (action.type) {
		case 'CONTROL_RESET': {
			const initialGameState = state.gameStates[0];
			invariant(initialGameState != null, `Couldn't find initial game state.`);
			return {
				...state,
				currentGame: initialGameState,
				currentGameIndex: 0,
				control: {
					...state.control,
					speed: state.control.speed,
					state: ProgramState.Pending,
				},
				gameStates: [initialGameState],
				level: state.level,
			};
		}
	}
}

interface ResetControlProps {
	dispatch: Dispatch<ResetControlAction>;
}

const style = css`
	&[disabled],
	&:disabled {
		background-color: gray;
		border-color: #404040;
	}
	&:active:not(:disabled) {
		box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
		transform: translate(1px, 1px);
	}
	&:focus {
		outline: none;
	}
	align-items: center;
	box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
	background: #854635;
	border-radius: 5px;
	border: 3px solid #42231a;
	cursor: pointer;
	display: flex;
	height: 70px;
	justify-content: center;
	width: 70px;
`;

const squareStyle = css`
	background: rgba(0, 0, 0, 0.5);
	width: 60%;
	height: 60%;
`;

export const ResetControl = (props: ResetControlProps) => {
	const { dispatch } = props;

	const onClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			dispatch({ type: 'CONTROL_RESET' });
		},
		[dispatch],
	);

	return (
		<button css={style} onClick={onClick}>
			<div css={squareStyle} />
		</button>
	);
};
