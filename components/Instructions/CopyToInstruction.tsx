/** @jsxImportSource @emotion/react */
import { GameState } from '@app/components/Scene';
import { css } from '@emotion/react';
import { GameError } from 'lib/GameError';

export type CopyToInstructionAction = {
	type: 'INSTRUCTION_COPY_TO';
	payload: {
		programMemoryAddress: number;
	};
};

export function copyToInstructionReducer(state: GameState, action: CopyToInstructionAction): GameState | GameError {
	switch (action.type) {
		case 'INSTRUCTION_COPY_TO': {
			const { programMemoryAddress } = action.payload;
			if (programMemoryAddress > state.memory.length - 1) {
				return new CopyToMemoryOutOfBoundError(programMemoryAddress, state.memory.length);
			}

			const { carry } = state;
			if (carry == null) {
				return new CopyToNullCarryError(programMemoryAddress);
			}

			const { stackPointer: currentStackPointer } = state;
			const newMemory = state.memory.slice(0);
			newMemory[programMemoryAddress] = carry;

			return {
				...state,
				stackPointer: currentStackPointer + 1,
				memory: newMemory,
			};
		}
	}
}

export class CopyToNullCarryError extends GameError {
	public constructor(public readonly programMemoryAddress: number) {
		super(`You cannot copy null to: ${programMemoryAddress}, it must be a non-null value.`);
		Object.setPrototypeOf(this, CopyToNullCarryError.prototype);
	}
}

export class CopyToMemoryOutOfBoundError extends GameError {
	public constructor(public readonly programMemoryAddress: number, public readonly programMemoryLength: number) {
		super(
			`You cannot copy to program memory address: ${programMemoryAddress}, as it is out of bounds with the available memory. Highest available program memory address: ${
				programMemoryLength - 1
			}`,
		);
		Object.setPrototypeOf(this, CopyToMemoryOutOfBoundError.prototype);
	}
}

interface CopyToInstructionProps {
	isCurrent?: boolean;
}

const baseStyle = css`
	border: 1px solid transparent;
	padding: 5px 5px 5px 0;
`;

const currentStyle = css`
	${baseStyle}
	border: 1px solid pink
`;

export const CopyToInstruction = (props: CopyToInstructionProps) => {
	const { isCurrent = false } = props;
	const style = isCurrent ? currentStyle : baseStyle;
	return <li css={style}>Copy to</li>;
};
