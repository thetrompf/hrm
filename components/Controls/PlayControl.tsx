/** @jsxImportSource @emotion/react */
import { ControlState, ProgramState } from '@app/components/Scene';
import { css } from '@emotion/react';
import { GameError } from 'lib/GameError';
import React, { Dispatch, useCallback } from 'react';

export type PlayControlAction = { type: 'CONTROL_PLAY' };

export function playControlReducer(state: ControlState, action: PlayControlAction): ControlState {
	switch (action.type) {
		case 'CONTROL_PLAY':
			return {
				...state,
				state: ProgramState.Running,
			};
	}
}

interface PlayControlProps {
	gameState: ControlState['state'];
	dispatch: Dispatch<PlayControlAction>;
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
	height: 80px;
	justify-content: center;
	width: 80px;
`;

const symbolStyle = css`
	border-bottom: 25px solid transparent;
	border-left: 45px solid rgba(0, 0, 0, 0.5);
	border-top: 25px solid transparent;
	height: 0;
	width: 0;
`;

export const PlayControl = (props: PlayControlProps) => {
	const { dispatch, gameState } = props;
	const disabled =
		gameState instanceof GameError || gameState === ProgramState.Finished || gameState === ProgramState.Running;

	const onClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			dispatch({ type: 'CONTROL_PLAY' });
		},
		[dispatch],
	);

	return (
		<button css={style} disabled={disabled} onClick={onClick}>
			<div css={symbolStyle} />
		</button>
	);
};
