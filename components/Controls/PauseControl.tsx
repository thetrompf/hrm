/** @jsxImportSource @emotion/react */
import { ControlState, ProgramState } from '@app/components/Scene';
import React, { Dispatch, useCallback } from 'react';
import { css } from '@emotion/react';

export type PauseControlAction = { type: 'CONTROL_PAUSE' };

export function pauseControlReducer(state: ControlState, action: PauseControlAction): ControlState {
	switch (action.type) {
		case 'CONTROL_PAUSE':
			return {
				...state,
				state: ProgramState.Paused,
			};
	}
}

interface PauseControlProps {
	dispatch: Dispatch<PauseControlAction>;
	gameState: ControlState['state'];
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

const squareStyle = css`
	background: rgba(0, 0, 0, 0.5);
	width: 25%;
	height: 60%;
`;

export const PauseControl = (props: PauseControlProps) => {
	const { dispatch, gameState } = props;
	const disabled = gameState !== ProgramState.Running;

	const onClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			dispatch({ type: 'CONTROL_PAUSE' });
		},
		[dispatch],
	);

	return (
		<button disabled={disabled} onClick={onClick} css={style}>
			<div css={squareStyle} />
			<div css={squareStyle} />
		</button>
	);
};
