/** @jsxImportSource @emotion/react */
import { GameState } from '@app/components/Scene';
import { css } from '@emotion/react';
import { GameError } from 'lib/GameError';

export type AddInstructionAction = {
	type: 'INSTRUCTION_ADD';
	payload: {
		programMemoryAddress: number;
	};
};

export function addInstructionReducer(state: GameState, action: AddInstructionAction): GameState | GameError {
	switch (action.type) {
		case 'INSTRUCTION_ADD': {
			const { programMemoryAddress } = action.payload;
			if (programMemoryAddress > state.memory.length - 1) {
				return new AddMemoryOutOfBoundError(programMemoryAddress, state.memory.length);
			}

			const { carry } = state;
			if (carry == null) {
				return new AddCarryNullError();
			}

			if (typeof carry === 'string') {
				return new AddCarryStringError(carry);
			}

			const currentMemory = state.memory;
			const currentValue = currentMemory[programMemoryAddress];
			if (currentValue == null) {
				return new AddNullError(programMemoryAddress);
			}

			if (typeof currentValue === 'string') {
				return new AddStringError(programMemoryAddress, currentValue);
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

export class AddCarryNullError extends GameError {
	public constructor() {
		super(`Carry must contain a non-null value to add.`);
		Object.setPrototypeOf(this, AddCarryNullError.prototype);
	}
}

export class AddMemoryOutOfBoundError extends GameError {
	public constructor(public readonly programMemoryAddress: number, public readonly programMemoryLength: number) {
		super(
			`You cannot copy from program memory address: ${programMemoryAddress}, as it is out of bounds with the available memory. Highest available program memory address: ${
				programMemoryLength - 1
			}`,
		);
		Object.setPrototypeOf(this, AddMemoryOutOfBoundError.prototype);
	}
}

export class AddNullError extends GameError {
	public constructor(public readonly programMemoryAddress: number) {
		super(`You cannot add: ${programMemoryAddress}, as it must contain a non-null value.`);
		Object.setPrototypeOf(this, AddNullError.prototype);
	}
}

export class AddCarryStringError extends GameError {
	public constructor(public readonly currentValue: string) {
		super(`You can only add when carry is a number, got: ${currentValue}`);
		Object.setPrototypeOf(this, AddCarryStringError.prototype);
	}
}

export class AddStringError extends GameError {
	public constructor(public readonly programMemoryAddress: number, public readonly currentValue: string) {
		super(`You can only add numbers, got: ${currentValue}`);
		Object.setPrototypeOf(this, AddStringError.prototype);
	}
}

interface AddInstructionProps {
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

export const AddInstruction = (props: AddInstructionProps) => {
	const { isCurrent = false } = props;
	const style = isCurrent ? currentStyle : baseStyle;
	return <li css={style}>Add</li>;
};
