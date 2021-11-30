/** @jsxImportSource @emotion/react */
import { PlayControl, PlayControlAction } from '@app/components/Controls/PlayControl';
import { ResetControl, ResetControlAction } from '@app/components/Controls/ResetControl';
import { SpeedSliderControl, SpeedSliderControlAction } from '@app/components/Controls/SpeedSliderControl';
import { StepBackwardControl, StepBackwardControlAction } from '@app/components/Controls/StepBackwardControl';
import { StepForwardControl, StepForwardControlAction } from '@app/components/Controls/StepForwardControl';
import { PauseControl, PauseControlAction } from '@app/components/Controls/PauseControl';
import { GameSpeed, ProgramState } from '@app/components/Scene';
import { GameError } from 'lib/GameError';
import { Dispatch } from 'react';
import { css } from '@emotion/react';

type ControlsAction =
	| PlayControlAction
	| ResetControlAction
	| SpeedSliderControlAction
	| StepBackwardControlAction
	| StepForwardControlAction
	| PauseControlAction;

type ControlsDispatcher = Dispatch<ControlsAction>;

interface ControlsPanelProps {
	currentGameIndex: number;
	gameState: ProgramState | GameError;
	maxGameIndex: number;
	dispatch: ControlsDispatcher;
	speed: GameSpeed;
}

const style = css`
	align-self: flex-end;
	grid-area: controls-panel;
	background: linear-gradient(#141311 5%, #322f2a);
	border: 1px solid transparent;
	border-radius: 8px 8px 0 0;
	padding: 30px 30px 20px 30px;
	max-height: 150px;
	max-width: 700px;

	& > * {
		align-items: flex-end;
		display: flex;
		gap: 5px;
	}
`;

export const ControlsPanel = (props: ControlsPanelProps) => {
	const { currentGameIndex, dispatch, gameState, maxGameIndex, speed } = props;
	return (
		<section css={style}>
			<div>
				<ResetControl dispatch={dispatch} />
				<StepBackwardControl currentGameIndex={currentGameIndex} dispatch={dispatch} />
				<PlayControl dispatch={dispatch} gameState={gameState} />
				<PauseControl dispatch={dispatch} gameState={gameState} />
				<StepForwardControl
					currentGameIndex={currentGameIndex}
					dispatch={dispatch}
					gameState={gameState}
					maxGameIndex={maxGameIndex}
				/>
				<SpeedSliderControl dispatch={dispatch} speed={speed} />
			</div>
		</section>
	);
};
