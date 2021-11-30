/** @jsxImportSource @emotion/react */
import { GameState } from '@app/components/Scene';
import { css } from '@emotion/react';
import { GameError } from 'lib/GameError';

export type JumpInstructionAction = {
	type: 'INSTRUCTION_JUMP';
	payload: {
		programStackAddress: number;
	};
};

export function jumpInstructionReducer(state: GameState, action: JumpInstructionAction): GameState | GameError {
	switch (action.type) {
		case 'INSTRUCTION_JUMP': {
			const { programStackAddress } = action.payload;
			const { stack: currentStack } = state;

			const newInstruction = currentStack[programStackAddress];
			if (newInstruction == null) {
				return new JumpStackOutOfBoundError(programStackAddress, currentStack.length);
			} else {
				return {
					...state,
					stackPointer: programStackAddress,
				};
			}
		}
	}
}

export class JumpCarryNullError extends GameError {
	public constructor() {
		super(`Carry must contain a non-null value to jump if negative.`);
		Object.setPrototypeOf(this, JumpCarryNullError.prototype);
	}
}

export class JumpStackOutOfBoundError extends GameError {
	public constructor(public readonly programStackAddress: number, public readonly programStackLength: number) {
		super(
			`You cannot jump to program stack address: ${programStackAddress}, as it is out of bounds with the available stack address space. Highest available program stack address: ${
				programStackLength - 1
			}`,
		);
		Object.setPrototypeOf(this, JumpStackOutOfBoundError.prototype);
	}
}

interface JumpInstructionProps {
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

export const JumpInstruction = (props: JumpInstructionProps) => {
	const { isCurrent = false } = props;
	const style = isCurrent ? currentStyle : baseStyle;
	return <li css={style}>Jump</li>;
};
