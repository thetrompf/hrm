/** @jsxImportSource @emotion/react */
import { GameState } from '@app/components/Scene';
import { css } from '@emotion/react';
import { GameError } from 'lib/GameError';

export type IncrementInstructionAction = {
	type: 'INSTRUCTION_INCREMENT';
	payload: {
		programMemoryAddress: number;
	};
};

export function incrementInstructionReducer(
	state: GameState,
	action: IncrementInstructionAction,
): GameState | GameError {
	switch (action.type) {
		case 'INSTRUCTION_INCREMENT': {
			const { programMemoryAddress } = action.payload;
			if (programMemoryAddress > state.memory.length - 1) {
				return new IncrementMemoryOutOfBoundError(programMemoryAddress, state.memory.length);
			}

			const currentMemory = state.memory;
			const currentValue = currentMemory[programMemoryAddress];
			if (currentValue == null) {
				return new IncrementNullError(programMemoryAddress);
			}

			const newMemory = currentMemory.slice(0);
			if (typeof currentValue === 'string') {
				return new IncrementStringError(programMemoryAddress, currentValue);
			}

			const newValue = currentValue + 1;
			newMemory[programMemoryAddress] = newValue;

			return {
				...state,
				carry: newValue,
				memory: newMemory,
				stackPointer: state.stackPointer + 1,
			};
		}
	}
}

export class IncrementMemoryOutOfBoundError extends GameError {
	public constructor(public readonly programMemoryAddress: number, public readonly programMemoryLength: number) {
		super(
			`You cannot copy from program memory address: ${programMemoryAddress}, as it is out of bounds with the available memory. Highest available program memory address: ${
				programMemoryLength - 1
			}`,
		);
		Object.setPrototypeOf(this, IncrementMemoryOutOfBoundError.prototype);
	}
}

export class IncrementNullError extends GameError {
	public constructor(public readonly programMemoryAddress: number) {
		super(`You cannot increment: ${programMemoryAddress}, as it must contain a non-null value.`);
		Object.setPrototypeOf(this, IncrementNullError.prototype);
	}
}

export class IncrementStringError extends GameError {
	public constructor(public readonly programMemoryAddress: number, public readonly currentValue: string) {
		super(`You can only increment numbers, got: ${currentValue}`);
		Object.setPrototypeOf(this, IncrementStringError.prototype);
	}
}

interface IncrementInstructionProps {
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

export const IncrementInstruction = (props: IncrementInstructionProps) => {
	const { isCurrent = false } = props;
	const style = isCurrent ? currentStyle : baseStyle;
	return <li css={style}>Increment</li>;
};
