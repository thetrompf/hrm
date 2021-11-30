import { CopyFromInstruction, CopyFromInstructionAction } from '@app/components/Instructions/CopyFromInstruction';
import { CopyToInstruction, CopyToInstructionAction } from '@app/components/Instructions/CopyToInstruction';
import { DecrementInstruction, DecrementInstructionAction } from '@app/components/Instructions/DecrementInstruction';
import { LoadInstruction, LoadInstructionAction } from '@app/components/Instructions/LoadInstruction';
import { IncrementInstruction, IncrementInstructionAction } from '@app/components/Instructions/IncrementInstruction';
import {
	JumpIfNegativeInstruction,
	JumpIfNegativeInstructionAction,
} from '@app/components/Instructions/JumpIfNegativeInstruction';
import { JumpIfZeroInstruction, JumpIfZeroInstructionAction } from '@app/components/Instructions/JumpIfZeroInstruction';
import { JumpInstruction, JumpInstructionAction } from '@app/components/Instructions/JumpInstruction';
import { ReturnInstruction, ReturnInstructionAction } from '@app/components/Instructions/ReturnInstruction';
import { assertNever } from 'lib/util';
import { AddInstruction, AddInstructionAction } from '@app/components/Instructions/AddInstruction';
import { SubtractInstruction, SubtractInstructionAction } from '@app/components/Instructions/SubtractInstruction';

export function instructionActionToComponent(
	instructionAction: InstructionAction,
	isCurrent: boolean,
	key: number | string,
) {
	const instructionActionType = instructionAction.type;
	switch (instructionAction.type) {
		case 'INSTRUCTION_ADD':
			return <AddInstruction isCurrent={isCurrent} key={key} />;
		case 'INSTRUCTION_SUBTRACT':
			return <SubtractInstruction isCurrent={isCurrent} key={key} />;
		case 'INSTRUCTION_COPY_FROM':
			return <CopyFromInstruction isCurrent={isCurrent} key={key} />;
		case 'INSTRUCTION_COPY_TO':
			return <CopyToInstruction isCurrent={isCurrent} key={key} />;
		case 'INSTRUCTION_DECREMENT':
			return <DecrementInstruction isCurrent={isCurrent} key={key} />;
		case 'INSTRUCTION_INCREMENT':
			return <IncrementInstruction isCurrent={isCurrent} key={key} />;
		case 'INSTRUCTION_JUMP_IF_NEGATIVE':
			return <JumpIfNegativeInstruction isCurrent={isCurrent} key={key} />;
		case 'INSTRUCTION_JUMP_IF_ZERO':
			return <JumpIfZeroInstruction isCurrent={isCurrent} key={key} />;
		case 'INSTRUCTION_JUMP':
			return <JumpInstruction isCurrent={isCurrent} key={key} />;
		case 'INSTRUCTION_LOAD':
			return <LoadInstruction isCurrent={isCurrent} key={key} />;
		case 'INSTRUCTION_RETURN':
			return <ReturnInstruction isCurrent={isCurrent} key={key} />;
		default:
			assertNever(instructionAction, `Unsupported instruction: ${instructionActionType}`);
	}
}

export type InstructionAction =
	| AddInstructionAction
	| CopyFromInstructionAction
	| CopyToInstructionAction
	| DecrementInstructionAction
	| IncrementInstructionAction
	| JumpIfNegativeInstructionAction
	| JumpIfZeroInstructionAction
	| JumpInstructionAction
	| LoadInstructionAction
	| ReturnInstructionAction
	| SubtractInstructionAction;

export type InstructionType = InstructionAction['type'];

const listStyles: React.CSSProperties = {
	listStyle: 'none',
	paddingLeft: 0,
};

const style: React.CSSProperties = {
	gridArea: 'instructions-catalog',
};

type InstructionSet = { readonly [K in InstructionType]: boolean };

interface InstructionsCatalogProps {
	instructions?: InstructionSet;
}

function isInstructionEnabled(instructions: InstructionSet | null | undefined, instruction: InstructionType) {
	if (instructions == null) {
		return true;
	}
	return instructions[instruction] ?? false;
}

export const InstructionsCatalog = (props: InstructionsCatalogProps) => {
	const { instructions } = props;
	return (
		<section style={style}>
			<h3>Instructions</h3>
			<ol style={listStyles}>
				{isInstructionEnabled(instructions, 'INSTRUCTION_COPY_FROM') && <CopyFromInstruction />}
				{isInstructionEnabled(instructions, 'INSTRUCTION_COPY_TO') && <CopyToInstruction />}
				{isInstructionEnabled(instructions, 'INSTRUCTION_DECREMENT') && <DecrementInstruction />}
				{isInstructionEnabled(instructions, 'INSTRUCTION_INCREMENT') && <IncrementInstruction />}
				{isInstructionEnabled(instructions, 'INSTRUCTION_ADD') && <AddInstruction />}
				{isInstructionEnabled(instructions, 'INSTRUCTION_SUBTRACT') && <SubtractInstruction />}
				{isInstructionEnabled(instructions, 'INSTRUCTION_LOAD') && <LoadInstruction />}
				{isInstructionEnabled(instructions, 'INSTRUCTION_RETURN') && <ReturnInstruction />}
				{isInstructionEnabled(instructions, 'INSTRUCTION_JUMP_IF_NEGATIVE') && <JumpIfNegativeInstruction />}
				{isInstructionEnabled(instructions, 'INSTRUCTION_JUMP_IF_ZERO') && <JumpIfZeroInstruction />}
				{isInstructionEnabled(instructions, 'INSTRUCTION_JUMP') && <JumpInstruction />}
			</ol>
		</section>
	);
};
