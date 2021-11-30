/** @jsxImportSource @emotion/react */
import { Byte, ByteValue } from '@app/components/Byte';
import { css } from '@emotion/react';

interface ProgramMemoryProps {
	values: readonly ByteValue[];
}

const style = css`
	grid-area: program-memory;
	& > ol {
		display: flex;
		gap: 5px;
		list-style: none;
		padding-left: 0;
	}
`;

export const ProgramMemory = (props: ProgramMemoryProps) => {
	const { values } = props;
	return (
		<section css={style}>
			<h3>Program memory</h3>
			<ol>
				{values.map((value, idx) => (
					<Byte key={idx} value={value} />
				))}
			</ol>
		</section>
	);
};
