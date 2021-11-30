/** @jsxImportSource @emotion/react */
import { Byte, ByteValue } from '@app/components/Byte';
import { css } from '@emotion/react';

interface ProgramInputProps {
	values: readonly ByteValue[];
}

const listStyle: React.CSSProperties = {};

const style = css`
	grid-area: program-input;
	& > ol {
		display: flex;
		flex-direction: column-reverse;
		gap: 5px;
		list-style: none;
		padding-left: 0;
	}
`;

export const ProgramInput = (props: ProgramInputProps) => {
	const { values } = props;
	return (
		<section css={style}>
			<h3>Program input</h3>
			<ol style={listStyle}>
				{values.map((value, idx) => (
					<Byte key={idx} value={value} />
				))}
			</ol>
		</section>
	);
};
