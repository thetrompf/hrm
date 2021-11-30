/** @jsxImportSource @emotion/react */
import { GameState } from '@app/components/Scene';
import { css } from '@emotion/react';
import { GameError } from 'lib/GameError';

export type JumpIfZeroInstructionAction = {
	type: 'INSTRUCTION_JUMP_IF_ZERO';
	payload: {
		programStackAddress: number;
	};
};

export function jumpIfZeroInstructionReducer(
	state: GameState,
	action: JumpIfZeroInstructionAction,
): GameState | GameError {
	switch (action.type) {
		case 'INSTRUCTION_JUMP_IF_ZERO': {
			const { carry } = state;
			if (carry == null) {
				return new JumpIfZeroCarryNullError();
			}

			const { programStackAddress } = action.payload;
			const { stack: currentStack } = state;
			if (carry === 0) {
				const zeroInstruction = currentStack[programStackAddress];
				if (zeroInstruction == null) {
					return new JumpIfZeroStackOutOfBoundError(programStackAddress, currentStack.length);
				} else {
					return {
						...state,
						stackPointer: programStackAddress,
					};
				}
			}

			const { stackPointer: currentStackPointer } = state;
			return {
				...state,
				stackPointer: currentStackPointer + 1,
			};
		}
	}
}

export class JumpIfZeroCarryNullError extends GameError {
	public constructor() {
		super(`Carry must contain a non-null value to jump if negative.`);
		Object.setPrototypeOf(this, JumpIfZeroCarryNullError.prototype);
	}
}

export class JumpIfZeroStackOutOfBoundError extends GameError {
	public constructor(public readonly programStackAddress: number, public readonly programStackLength: number) {
		super(
			`You cannot jump to program stack address: ${programStackAddress}, as it is out of bounds with the available stack address space. Highest available program stack address: ${
				programStackLength - 1
			}`,
		);
		Object.setPrototypeOf(this, JumpIfZeroStackOutOfBoundError.prototype);
	}
}

interface JumpIfZeroInstructionProps {
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

export const JumpIfZeroInstruction = (props: JumpIfZeroInstructionProps) => {
	const { isCurrent = false } = props;
	const style = isCurrent ? currentStyle : baseStyle;
	return <li css={style}>Jump if zero</li>;
};
