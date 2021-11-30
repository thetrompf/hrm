import { ByteValue } from '@app/components/Byte';
import { GameState, SceneState } from '@app/components/Scene';
import { GameError } from 'lib/GameError';

export type ReturnInstructionAction = {
	type: 'INSTRUCTION_RETURN';
};

export function returnInstructionReducer(state: SceneState, action: ReturnInstructionAction): GameState | GameError {
	switch (action.type) {
		case 'INSTRUCTION_RETURN': {
			const { currentGame } = state;
			const { carry: currentCarry, stackPointer: currentStackPointer } = currentGame;

			if (currentCarry == null) {
				return new ReturnCarryNullError();
			}

			if (currentCarry !== state.level.output[currentGame.output.length]) {
				return new ReturnInvalidValidError(
					currentCarry,
					state.level.output[currentGame.output.length] as ByteValue,
				);
			}
			const newOutput = currentGame.output.slice(0);
			newOutput.push(currentCarry);

			return {
				...currentGame,
				carry: null,
				output: newOutput,
				stackPointer: currentStackPointer + 1,
			};
		}
	}
}

export class ReturnCarryNullError extends GameError {
	public constructor() {
		super(`Carry must contain a non-null value to return value to program output.`);
		Object.setPrototypeOf(this, ReturnCarryNullError.prototype);
	}
}

export class ReturnInvalidValidError extends GameError {
	public constructor(carryValue: ByteValue, expectedValue: ByteValue) {
		super(`Expected return value: ${expectedValue}, got: ${carryValue}.`);
		Object.setPrototypeOf(this, ReturnCarryNullError.prototype);
	}
}

interface ReturnInstructionProps {
	isCurrent?: boolean;
}

const baseStyle: React.CSSProperties = {
	border: '1px solid transparent',
	padding: '5px 5px 5px 0',
};

const currentStyle: React.CSSProperties = {
	...baseStyle,
	border: '1px solid pink',
};

export const ReturnInstruction = (props: ReturnInstructionProps) => {
	const { isCurrent = false } = props;
	const style = isCurrent ? currentStyle : baseStyle;
	return <li style={style}>Return</li>;
};
