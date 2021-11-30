/** @jsxImportSource @emotion/react */
import { GameState } from '@app/components/Scene';
import { css } from '@emotion/react';
import { GameError } from 'lib/GameError';

export type SubtractInstructionAction = {
	type: 'INSTRUCTION_SUBTRACT';
	payload: {
		programMemoryAddress: number;
	};
};

export function subtractInstructionReducer(state: GameState, action: SubtractInstructionAction): GameState | GameError {
	switch (action.type) {
		case 'INSTRUCTION_SUBTRACT': {
			const { programMemoryAddress } = action.payload;
			if (programMemoryAddress > state.memory.length - 1) {
				return new SubtractMemoryOutOfBoundError(programMemoryAddress, state.memory.length);
			}

			const { carry } = state;
			if (carry == null) {
				return new SubtractCarryNullError();
			}

			if (typeof carry === 'string') {
				return new SubtractCarryStringError(carry);
			}

			const currentMemory = state.memory;
			const currentValue = currentMemory[programMemoryAddress];
			if (currentValue == null) {
				return new SubtractNullError(programMemoryAddress);
			}

			if (typeof currentValue === 'string') {
				return new SubtractStringError(programMemoryAddress, currentValue);
			}

			const { stackPointer: currentStackPointer } = state;
			const newCarry = currentValue + carry;

			return {
				...state,
				carry: newCarry,
				stackPointer: currentStackPointer + 1,
			};
		}
	}
}

export class SubtractCarryNullError extends GameError {
	public constructor() {
		super(`Carry must contain a non-null value to subtract.`);
		Object.setPrototypeOf(this, SubtractCarryNullError.prototype);
	}
}

export class SubtractMemoryOutOfBoundError extends GameError {
	public constructor(public readonly programMemoryAddress: number, public readonly programMemoryLength: number) {
		super(
			`You cannot copy from program memory address: ${programMemoryAddress}, as it is out of bounds with the available memory. Highest available program memory address: ${
				programMemoryLength - 1
			}`,
		);
		Object.setPrototypeOf(this, SubtractMemoryOutOfBoundError.prototype);
	}
}

export class SubtractNullError extends GameError {
	public constructor(public readonly programMemoryAddress: number) {
		super(`You cannot subtract: ${programMemoryAddress}, as it must contain a non-null value.`);
		Object.setPrototypeOf(this, SubtractNullError.prototype);
	}
}

export class SubtractCarryStringError extends GameError {
	public constructor(public readonly currentValue: string) {
		super(`You can only subtract when carry is a number, got: ${currentValue}`);
		Object.setPrototypeOf(this, SubtractCarryStringError.prototype);
	}
}

export class SubtractStringError extends GameError {
	public constructor(public readonly programMemoryAddress: number, public readonly currentValue: string) {
		super(`You can only subtract numbers, got: ${currentValue}`);
		Object.setPrototypeOf(this, SubtractStringError.prototype);
	}
}

interface SubtractInstructionProps {
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

export const SubtractInstruction = (props: SubtractInstructionProps) => {
	const { isCurrent = false } = props;
	const style = isCurrent ? currentStyle : baseStyle;
	return <li css={style}>Subtract</li>;
};
