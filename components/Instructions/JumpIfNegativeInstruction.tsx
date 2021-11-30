/** @jsxImportSource @emotion/react */
import { GameState } from '@app/components/Scene';
import { css } from '@emotion/react';
import { GameError } from 'lib/GameError';

export type JumpIfNegativeInstructionAction = {
	type: 'INSTRUCTION_JUMP_IF_NEGATIVE';
	payload: {
		programStackAddress: number;
	};
};

export function jumpIfNegativeInstructionReducer(
	state: GameState,
	action: JumpIfNegativeInstructionAction,
): GameState | GameError {
	switch (action.type) {
		case 'INSTRUCTION_JUMP_IF_NEGATIVE': {
			const { carry } = state;
			if (carry == null) {
				return new JumpIfNegativeCarryNullError();
			}

			const { programStackAddress } = action.payload;
			const { stack: currentStack } = state;
			if (typeof carry === 'number' && carry < 0) {
				const negativeInstruction = currentStack[programStackAddress];
				if (negativeInstruction == null) {
					return new JumpIfNegativeStackOutOfBoundError(programStackAddress, currentStack.length);
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

export class JumpIfNegativeCarryNullError extends GameError {
	public constructor() {
		super(`Carry must contain a non-null value to jump if negative.`);
		Object.setPrototypeOf(this, JumpIfNegativeCarryNullError.prototype);
	}
}

export class JumpIfNegativeStackOutOfBoundError extends GameError {
	public constructor(public readonly programStackAddress: number, public readonly programStackLength: number) {
		super(
			`You cannot jump to program stack address: ${programStackAddress}, as it is out of bounds with the available stack address space. Highest available program stack address: ${
				programStackLength - 1
			}`,
		);
		Object.setPrototypeOf(this, JumpIfNegativeStackOutOfBoundError.prototype);
	}
}

interface JumpIfNegativeInstructionProps {
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

export const JumpIfNegativeInstruction = (props: JumpIfNegativeInstructionProps) => {
	const { isCurrent = false } = props;
	const style = isCurrent ? currentStyle : baseStyle;
	return <li css={style}>Jump if negative</li>;
};
