/** @jsxImportSource @emotion/react */
import { GameState, ProgramState } from '@app/components/Scene';
import { css } from '@emotion/react';

export type LoadInstructionAction = {
	type: 'INSTRUCTION_LOAD';
};

export function loadInstructionReducer(
	state: GameState,
	action: LoadInstructionAction,
): GameState | ProgramState.Finished {
	switch (action.type) {
		case 'INSTRUCTION_LOAD': {
			const { stackPointer: currentStackPointer } = state;
			const newInput = state.input.slice(0);
			const nextCarry = newInput.pop();

			if (nextCarry == null) {
				return ProgramState.Finished;
			}

			return {
				...state,
				carry: nextCarry,
				input: newInput,
				stackPointer: currentStackPointer + 1,
			};
		}
	}
}

interface LoadInstructionProps {
	isCurrent?: boolean;
}

const baseStyle = css`
	border: 1px solid transparent;
	padding: 5px 5px 5px 0;
`;

const currentStyle = css`
	${baseStyle}
	border: 1px solid pink;
`;

export const LoadInstruction = (props: LoadInstructionProps) => {
	const { isCurrent = false } = props;
	const style = isCurrent ? currentStyle : baseStyle;
	return <li css={style}>Load</li>;
};
