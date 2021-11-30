import { ByteValue, InputByteValue } from '@app/components/Byte';
import { InstructionType } from '@app/components/Instructions/InstructionsCatalog';
import { invariant } from 'lib/util';

export function* positiveNumberGenerator(take: number): Generator<number, void, void> {
	invariant(take > 0, 'take must be a positive number');
	for (let i = take; i > 0; i--) yield Math.round(100 * Math.random());
}

export function* positiveNumberSequenceGenerator(take: number, start = 0) {
	invariant(take > 0, 'take must be a positive number');
	invariant(start >= 0, 'start must be zero or a positive number');
	for (let i = start; i < start + take; i++) yield i;
}

function isIterable(obj: unknown): obj is Iterable<unknown> {
	return typeof obj === 'object' && obj != null && typeof (obj as any)[Symbol.iterator] === 'function';
}

export function* outputGenerator<TInput extends InputByteValue>(
	mapFn: (input: TInput) => Iterable<ByteValue> | ByteValue,
): Generator<Iterable<ByteValue>, void, TInput> {
	let input = yield [];
	do {
		const output = mapFn(input);
		input = yield isIterable(output) ? output : [output];
	} while (true);
}

export interface Level<TInput extends InputByteValue> {
	readonly inputGenerator: Generator<TInput, void, void>;
	readonly inputToOutputMapFn: (input: TInput) => Iterable<ByteValue>;
	readonly inputCount: number;
	readonly instructions: {
		readonly [K in InstructionType]: boolean;
	};
	readonly programMemorySize: number;
}

export const passThrough3: Level<number> = {
	inputCount: 3,
	inputGenerator: positiveNumberGenerator(3),
	inputToOutputMapFn: (input) => [input],
	instructions: {
		INSTRUCTION_ADD: false,
		INSTRUCTION_COPY_FROM: false,
		INSTRUCTION_COPY_TO: false,
		INSTRUCTION_DECREMENT: false,
		INSTRUCTION_JUMP: false,
		INSTRUCTION_INCREMENT: false,
		INSTRUCTION_JUMP_IF_NEGATIVE: false,
		INSTRUCTION_JUMP_IF_ZERO: false,
		INSTRUCTION_LOAD: true,
		INSTRUCTION_RETURN: true,
		INSTRUCTION_SUBTRACT: false,
	},
	programMemorySize: 0,
};

export const double: Level<number> = {
	inputCount: 5,
	inputGenerator: positiveNumberGenerator(5),
	inputToOutputMapFn: (input) => [input * 2],
	instructions: {
		INSTRUCTION_ADD: false,
		INSTRUCTION_COPY_FROM: false,
		INSTRUCTION_COPY_TO: true,
		INSTRUCTION_DECREMENT: false,
		INSTRUCTION_JUMP: true,
		INSTRUCTION_INCREMENT: false,
		INSTRUCTION_JUMP_IF_NEGATIVE: false,
		INSTRUCTION_JUMP_IF_ZERO: false,
		INSTRUCTION_LOAD: true,
		INSTRUCTION_RETURN: true,
		INSTRUCTION_SUBTRACT: false,
	},
	programMemorySize: 1,
};

type InputFromLevel<TLevel extends Level<any>> = TLevel['inputGenerator'] extends Generator<infer TInput>
	? TInput
	: never;

type OutputFromLevel<TLevel extends Level<any>> = ReturnType<TLevel['inputToOutputMapFn']> extends Iterable<
	infer TOutput
>
	? TOutput
	: never;

export interface InitializedLevel<TLevel extends Level<any>> {
	input: readonly InputFromLevel<TLevel>[];
	output: readonly OutputFromLevel<TLevel>[];
	instructions: TLevel['instructions'];
	programMemorySize: TLevel['programMemorySize'];
}

export function initializeLevel<TLevel extends Level<any>>(level: TLevel): InitializedLevel<TLevel> {
	const input: readonly InputByteValue[] = [...level.inputGenerator] as const;
	return {
		input: input as readonly InputFromLevel<TLevel>[],
		output: input
			.reduce(
				(c, e) => c.concat(level.inputToOutputMapFn(e) as OutputFromLevel<TLevel>[]),
				[] as OutputFromLevel<TLevel>[],
			)
			.reverse(),
		instructions: level.instructions,
		programMemorySize: level.programMemorySize,
	};
}
