/** @jsxImportSource @emotion/react */
import { Byte, ByteValue } from '@app/components/Byte';
import { css } from '@emotion/react';

export interface ProgramOutputProps {
	values: readonly ByteValue[];
}

const style = css`
	grid-area: program-output;
	& > ol {
		display: flex;
		flex-direction: column-reverse;
		gap: 5px;
		list-style: none;
		padding-left: 0;
	}
`;

export const ProgramOutput = (props: ProgramOutputProps) => {
	const { values } = props;
	return (
		<section css={style}>
			<h3>Program output</h3>
			<ol>
				{values.map((value, idx) => (
					<Byte key={idx} value={value} />
				))}
			</ol>
		</section>
	);
};
