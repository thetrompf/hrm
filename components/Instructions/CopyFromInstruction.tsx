/** @jsxImportSource @emotion/react */
import { GameState } from '@app/components/Scene';
import { css } from '@emotion/react';
import { GameError } from 'lib/GameError';

export type CopyFromInstructionAction = {
	type: 'INSTRUCTION_COPY_FROM';
	payload: {
		programMemoryAddress: number;
	};
};

export function copyFromInstructionReducer(state: GameState, action: CopyFromInstructionAction): GameState | GameError {
	switch (action.type) {
		case 'INSTRUCTION_COPY_FROM': {
			const { programMemoryAddress } = action.payload;
			if (programMemoryAddress > state.memory.length - 1) {
				return new CopyFromMemoryOutOfBoundError(programMemoryAddress, state.memory.length);
			}
			const newCarry = state.memory[programMemoryAddress];
			if (newCarry == null) {
				return new CopyFromNullError(programMemoryAddress);
			}

			const { stackPointer: currentStackPointer } = state;
			return {
				...state,
				carry: newCarry,
				stackPointer: currentStackPointer + 1,
			};
		}
	}
}

export class CopyFromNullError extends GameError {
	public constructor(public readonly programMemoryAddress: number) {
		super(`You cannot copy from program memory address: ${programMemoryAddress}, as it contains no value.`);
		Object.setPrototypeOf(this, CopyFromNullError.prototype);
	}
}

export class CopyFromMemoryOutOfBoundError extends GameError {
	public constructor(public readonly programMemoryAddress: number, public readonly programMemoryLength: number) {
		super(
			`You cannot copy from program memory address: ${programMemoryAddress}, as it is out of bounds with the available memory. Highest available program memory address: ${
				programMemoryLength - 1
			}`,
		);
		Object.setPrototypeOf(this, CopyFromMemoryOutOfBoundError.prototype);
	}
}

interface CopyFromInstructionProps {
	isCurrent?: boolean;
	programMemoryAddress?: number;
}

const baseStyle = css`
	border: 1px solid transparent;
	padding: 5px 5px 5px 0;
`;

const currentStyle = css`
	${baseStyle}
	border: 1px solid pink
`;

export const CopyFromInstruction = (props: CopyFromInstructionProps) => {
	const { isCurrent = false } = props;
	const style = isCurrent ? currentStyle : baseStyle;
	return <li css={style}>Copy from</li>;
};
