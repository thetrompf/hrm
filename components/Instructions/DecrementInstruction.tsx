/** @jsxImportSource @emotion/react */
import { GameState } from '@app/components/Scene';
import { css } from '@emotion/react';
import { GameError } from 'lib/GameError';

export type DecrementInstructionAction = {
	type: 'INSTRUCTION_DECREMENT';
	payload: {
		programMemoryAddress: number;
	};
};

export function decrementInstructionReducer(
	state: GameState,
	action: DecrementInstructionAction,
): GameState | GameError {
	switch (action.type) {
		case 'INSTRUCTION_DECREMENT': {
			const { programMemoryAddress } = action.payload;
			if (programMemoryAddress > state.memory.length - 1) {
				return new DecrementMemoryOutOfBoundError(programMemoryAddress, state.memory.length);
			}

			const currentMemory = state.memory;
			const currentValue = currentMemory[programMemoryAddress];
			if (currentValue == null) {
				return new DecrementNullError(programMemoryAddress);
			}

			const newMemory = currentMemory.slice(0);
			if (typeof currentValue === 'string') {
				return new DecrementStringError(programMemoryAddress, currentValue);
			}

			const { stackPointer: currentStackPointer } = state;
			const newValue = currentValue - 1;
			newMemory[programMemoryAddress] = newValue;

			return {
				...state,
				carry: newValue,
				memory: newMemory,
				stackPointer: currentStackPointer + 1,
			};
		}
	}
}

export class DecrementMemoryOutOfBoundError extends GameError {
	public constructor(public readonly programMemoryAddress: number, public readonly programMemoryLength: number) {
		super(
			`You cannot copy from program memory address: ${programMemoryAddress}, as it is out of bounds with the available memory. Highest available program memory address: ${
				programMemoryLength - 1
			}`,
		);
		Object.setPrototypeOf(this, DecrementMemoryOutOfBoundError.prototype);
	}
}

export class DecrementNullError extends GameError {
	public constructor(public readonly programMemoryAddress: number) {
		super(`You cannot decrement: ${programMemoryAddress}, as it must contain a non-null value.`);
		Object.setPrototypeOf(this, DecrementNullError.prototype);
	}
}

export class DecrementStringError extends GameError {
	public constructor(public readonly programMemoryAddress: number, public readonly currentValue: string) {
		super(`You can only decrement numbers, got: ${currentValue}`);
		Object.setPrototypeOf(this, DecrementStringError.prototype);
	}
}

interface DecrementInstructionProps {
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

export const DecrementInstruction = (props: DecrementInstructionProps) => {
	const { isCurrent = false } = props;
	const style = isCurrent ? currentStyle : baseStyle;
	return <li css={style}>Decrement</li>;
};
