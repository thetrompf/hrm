/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export type LowerCaseChar =
	| 'a'
	| 'b'
	| 'c'
	| 'd'
	| 'e'
	| 'f'
	| 'g'
	| 'h'
	| 'i'
	| 'j'
	| 'k'
	| 'l'
	| 'm'
	| 'n'
	| 'o'
	| 'p'
	| 'q'
	| 'r'
	| 's'
	| 't'
	| 'u'
	| 'v'
	| 'w'
	| 'x'
	| 'y'
	| 'z';

export type UpperCaseChar =
	| 'A'
	| 'B'
	| 'C'
	| 'D'
	| 'E'
	| 'F'
	| 'G'
	| 'H'
	| 'I'
	| 'J'
	| 'K'
	| 'L'
	| 'M'
	| 'N'
	| 'O'
	| 'P'
	| 'Q'
	| 'R'
	| 'S'
	| 'T'
	| 'U'
	| 'V'
	| 'W'
	| 'X'
	| 'Y'
	| 'Z';

export type Char = LowerCaseChar | UpperCaseChar;

// export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type InputByteValue = Char | number;
export type ByteValue = number | string;

interface ByteProps {
	as?: 'li' | 'div';
	value: ByteValue;
}

const style = css`
	align-items: center;
	background: linear-gradient(180deg, #a7cf5c 0%, #b6d885 100%);
	border-top: #4e5f38 1px solid;
	border-left: #4e5f38 1px solid;
	border-right: #4e5f38 1px solid;
	border-bottom: #4e5f38 8px solid;
	box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
	color: #4b5e35;
	display: inline-flex;
	flex: 0 0 50px;
	font-size: 150%;
	font-weight: bold;
	height: 50px;
	justify-content: center;
	width: 50px;
`;

export const Byte = (props: ByteProps) =>
	props.as === 'div' ? <div css={style}>{props.value}</div> : <li css={style}>{props.value}</li>;
