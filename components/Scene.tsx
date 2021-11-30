/** @jsxImportSource @emotion/react */
import { Byte, ByteValue, InputByteValue } from '@app/components/Byte';
import { ControlsPanel } from '@app/components/Controls/ControlsPanel';
import { ProgramMemory } from '@app/components/ProgramMemory';
import { ProgramInput } from '@app/components/ProgramInput';
import { InstructionAction, InstructionsCatalog } from '@app/components/Instructions/InstructionsCatalog';
import { ProgramOutput } from '@app/components/ProgramOutput';
import { ProgramStack } from '@app/components/ProgramStack';
import {
	CopyFromInstructionAction,
	copyFromInstructionReducer,
} from '@app/components/Instructions/CopyFromInstruction';
import { CopyToInstructionAction, copyToInstructionReducer } from '@app/components/Instructions/CopyToInstruction';
import {
	DecrementInstructionAction,
	decrementInstructionReducer,
} from '@app/components/Instructions/DecrementInstruction';
import {
	IncrementInstructionAction,
	incrementInstructionReducer,
} from '@app/components/Instructions/IncrementInstruction';
import {
	JumpIfNegativeInstructionAction,
	jumpIfNegativeInstructionReducer,
} from '@app/components/Instructions/JumpIfNegativeInstruction';
import {
	JumpIfZeroInstructionAction,
	jumpIfZeroInstructionReducer,
} from '@app/components/Instructions/JumpIfZeroInstruction';
import { JumpInstructionAction, jumpInstructionReducer } from '@app/components/Instructions/JumpInstruction';
import { LoadInstructionAction, loadInstructionReducer } from '@app/components/Instructions/LoadInstruction';
import { ReturnInstructionAction, returnInstructionReducer } from '@app/components/Instructions/ReturnInstruction';
import { PlayControlAction, playControlReducer } from '@app/components/Controls/PlayControl';
import { ResetControlAction, resetControlReducer } from '@app/components/Controls/ResetControl';
import { SpeedSliderControlAction, speedSliderControlReducer } from '@app/components/Controls/SpeedSliderControl';
import { StepBackwardControlAction, stepBackwardControlReducer } from '@app/components/Controls/StepBackwardControl';
import { StepForwardControlAction, stepForwardControlReducer } from '@app/components/Controls/StepForwardControl';
import { PauseControlAction, pauseControlReducer } from '@app/components/Controls/PauseControl';
import { AddInstructionAction, addInstructionReducer } from '@app/components/Instructions/AddInstruction';
import {
	SubtractInstructionAction,
	subtractInstructionReducer,
} from '@app/components/Instructions/SubtractInstruction';
import { css } from '@emotion/react';
import { GameError } from 'lib/GameError';
import { useEffect, useReducer } from 'react';
import { double, Level, InitializedLevel, initializeLevel } from '@app/components/Level';

export enum ProgramState {
	Pending = 'PENDING',
	Paused = 'PAUSED',
	Running = 'RUNNING',
	Finished = 'FINISHED',
}

export interface ControlState {
	readonly speed: GameSpeed;
	readonly state: ProgramState | GameError;
}

export interface SceneState {
	readonly control: ControlState;
	readonly currentGame: GameState;
	readonly currentGameIndex: number;
	readonly gameStates: readonly GameState[];
	readonly level: InitializedLevel<Level<any>>;
}

export interface GameState {
	readonly carry: Maybe<ByteValue>;
	readonly input: readonly InputByteValue[];
	readonly memory: readonly ByteValue[];
	readonly output: readonly ByteValue[];
	readonly stack: readonly InstructionAction[];
	readonly stackPointer: number;
	readonly stepCounter: number;
}

interface SetGameErrorAction {
	type: 'SET_GAME_ERROR';
	payload: {
		error: GameError;
	};
}

export type GameStateAction =
	| AddInstructionAction
	| CopyFromInstructionAction
	| CopyToInstructionAction
	| DecrementInstructionAction
	| IncrementInstructionAction
	| JumpIfNegativeInstructionAction
	| JumpIfZeroInstructionAction
	| JumpInstructionAction
	| LoadInstructionAction
	| PlayControlAction
	| ResetControlAction
	| ReturnInstructionAction
	| SetGameErrorAction
	| SpeedSliderControlAction
	| StepBackwardControlAction
	| StepForwardControlAction
	| PauseControlAction
	| SubtractInstructionAction;

export type GameSpeed = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

function pushPreviousGameStates(
	state: SceneState,
	newGameState: GameState | ProgramState.Finished | GameError,
): SceneState {
	if (newGameState === ProgramState.Finished || newGameState instanceof GameError) {
		return {
			...state,
			control: {
				...state.control,
				state: newGameState,
			},
		};
	}

	return {
		...state,
		currentGame: newGameState,
		currentGameIndex: state.gameStates.length,
		gameStates: [...state.gameStates, newGameState],
	};
}

export function runCurrentInstruction(state: SceneState): SceneState {
	if (state.control.state instanceof GameError) {
		return state;
	}

	const instructionAction = state.currentGame.stack[state.currentGame.stackPointer];
	if (instructionAction == null) {
		if (state.currentGame.input.length === 0) {
			// TODO: run more simulations
			//       if simulations finds inputs,
			//       where the program is incorrect,
			//       set appropriate game state.
			return {
				...state,
				control: {
					...state.control,
					state: ProgramState.Finished,
				},
			};
		} else {
			return {
				...state,
				control: {
					...state.control,
					// TODO: set specific error for non-finished game.
					state: new GameError(`Unprocessed input.`),
				},
			};
		}
	}

	const nextState = reducer(state, instructionAction);
	if (nextState.control.state === ProgramState.Pending) {
		return {
			...nextState,
			control: {
				...nextState.control,
				state: ProgramState.Running,
			},
		};
	} else {
		return nextState;
	}
}

function reducer(state: SceneState, action: GameStateAction): SceneState {
	switch (action.type) {
		case 'CONTROL_PLAY':
			return {
				...state,
				control: playControlReducer(state.control, action),
			};
		case 'CONTROL_RESET':
			return resetControlReducer(state, action);
		case 'CONTROL_SPEED_SLIDER':
			return {
				...state,
				control: speedSliderControlReducer(state.control, action),
			};
		case 'CONTROL_STEP_BACKWARD':
			return stepBackwardControlReducer(state, action);
		case 'CONTROL_STEP_FORWARD':
			return stepForwardControlReducer(state, action);
		case 'CONTROL_PAUSE':
			return {
				...state,
				control: pauseControlReducer(state.control, action),
			};
		case 'INSTRUCTION_ADD':
			return pushPreviousGameStates(state, addInstructionReducer(state.currentGame, action));
		case 'INSTRUCTION_SUBTRACT':
			return pushPreviousGameStates(state, subtractInstructionReducer(state.currentGame, action));
		case 'INSTRUCTION_COPY_FROM':
			return pushPreviousGameStates(state, copyFromInstructionReducer(state.currentGame, action));
		case 'INSTRUCTION_COPY_TO':
			return pushPreviousGameStates(state, copyToInstructionReducer(state.currentGame, action));
		case 'INSTRUCTION_DECREMENT':
			return pushPreviousGameStates(state, decrementInstructionReducer(state.currentGame, action));
		case 'INSTRUCTION_INCREMENT':
			return pushPreviousGameStates(state, incrementInstructionReducer(state.currentGame, action));
		case 'INSTRUCTION_JUMP':
			return pushPreviousGameStates(state, jumpInstructionReducer(state.currentGame, action));
		case 'INSTRUCTION_JUMP_IF_NEGATIVE':
			return pushPreviousGameStates(state, jumpIfNegativeInstructionReducer(state.currentGame, action));
		case 'INSTRUCTION_JUMP_IF_ZERO':
			return pushPreviousGameStates(state, jumpIfZeroInstructionReducer(state.currentGame, action));
		case 'INSTRUCTION_LOAD':
			return pushPreviousGameStates(state, loadInstructionReducer(state.currentGame, action));
		case 'INSTRUCTION_RETURN':
			return pushPreviousGameStates(state, returnInstructionReducer(state, action));
		case 'SET_GAME_ERROR':
			return {
				...state,
				control: {
					...state.control,
					state: action.payload.error,
				},
			};
	}
}

let level = initializeLevel(double);

export const initialGameState: GameState = Object.freeze({
	carry: null,
	input: level.input,
	memory: Array(level.programMemorySize).fill(null),
	output: [],
	stack: [
		// {
		// 	type: 'INSTRUCTION_JUMP',
		// 	payload: {
		// 		programStackAddress: 3,
		// 	},
		// },
		// { type: 'INSTRUCTION_ADD', payload: { programMemoryAddress: 0 } },
		// { type: 'INSTRUCTION_COPY_TO', payload: { programMemoryAddress: 0 } },
		{ type: 'INSTRUCTION_LOAD' },
		{ type: 'INSTRUCTION_COPY_TO', payload: { programMemoryAddress: 0 } },
		{ type: 'INSTRUCTION_ADD', payload: { programMemoryAddress: 0 } },
		// { type: 'INSTRUCTION_INCREMENT', payload: { programMemoryAddress: 0 } },
		{ type: 'INSTRUCTION_RETURN' },
		// { type: 'INSTRUCTION_COPY_FROM', payload: { programMemoryAddress: 0 } },
		// { type: 'INSTRUCTION_LOAD' },
		// { type: 'INSTRUCTION_RETURN' },
		// { type: 'INSTRUCTION_LOAD' },
		// { type: 'INSTRUCTION_RETURN' },
		{
			type: 'INSTRUCTION_JUMP',
			payload: {
				programStackAddress: 0,
			},
		},
	],
	stackPointer: 0,
	stepCounter: 0,
});

export const initialSceneState: SceneState = {
	currentGame: initialGameState,
	currentGameIndex: 0,
	control: {
		speed: 2,
		state: ProgramState.Pending,
	},
	gameStates: [initialGameState],
	level: level,
};

const gridStyles = css`
	background: #d29873;
	display: grid;
	grid-template-areas:
		'program-carry    .                message          .                      .            '
		'program-input    program-memory   program-output   instructions-catalog   program-stack'
		'program-input    program-memory   program-output   instructions-catalog   program-stack'
		'controls-panel   controls-panel .                  .                      .            ';
	width: 100vw;
	height: 100vh;
`;

const carryStyles = css`
	display: flex;
	gap: 10px;
	grid-area: program-carry;
`;

export const Scene = () => {
	const [state, dispatch] = useReducer(reducer, initialSceneState);
	const { control, currentGameIndex, gameStates } = state;
	const game = gameStates[currentGameIndex];

	if (game == null) {
		throw new GameError(`Invalid game state index: ${currentGameIndex}`);
	}

	const maxGameIndex = gameStates.length - 1;
	const error =
		control.state instanceof GameError ? (
			<h3 style={{ color: 'red', gridArea: 'message' }}>Error: {control.state.message}</h3>
		) : null;
	const success =
		control.state === ProgramState.Finished ? (
			<h3 style={{ color: 'green', gridArea: 'message' }}>Victory!</h3>
		) : null;

	useEffect(() => {
		if (state.control.state !== ProgramState.Running) {
			return;
		}

		const timeout = window.setTimeout(() => {
			dispatch({ type: 'CONTROL_STEP_FORWARD' });
		}, 1000 / state.control.speed);

		return () => window.clearTimeout(timeout);
	}, [state]);

	return (
		<main css={gridStyles}>
			<section css={carryStyles}>
				<h3>Carry</h3>
				{game.carry == null ? null : <Byte as="div" value={game.carry} />}
			</section>
			{error}
			{success}
			<ProgramInput values={game.input} />
			<ProgramMemory values={game.memory} />
			<ProgramOutput values={game.output} />
			<InstructionsCatalog instructions={state.level.instructions} />
			<ProgramStack currentStackPointer={game.stackPointer} gameState={control.state} values={game.stack} />
			<ControlsPanel
				currentGameIndex={currentGameIndex}
				dispatch={dispatch}
				gameState={control.state}
				maxGameIndex={maxGameIndex}
				speed={control.speed}
			/>
		</main>
	);
};
