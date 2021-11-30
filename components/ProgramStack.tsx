/** @jsxImportSource @emotion/react */
import { InstructionAction, instructionActionToComponent } from '@app/components/Instructions/InstructionsCatalog';
import { ControlState, ProgramState } from '@app/components/Scene';
import { css } from '@emotion/react';

interface ProgramStackProps {
	currentStackPointer: number;
	gameState: ControlState['state'];
	values: readonly InstructionAction[];
}

const style = css`
	grid-area: program-stack;
	& > ol {
		list-style-type: decimal-leading-zero;
		padding-left: 0px;
		margin-left: 24px;
	}
`;

export const ProgramStack = (props: ProgramStackProps) => {
	const { currentStackPointer, gameState, values } = props;
	const isPending = gameState === ProgramState.Pending;

	return (
		<section css={style}>
			<h3>Program stack</h3>
			<ol start={0}>
				{values.map((instructionAction, idx) =>
					instructionActionToComponent(instructionAction, !isPending && currentStackPointer === idx, idx),
				)}
			</ol>
		</section>
	);
};
