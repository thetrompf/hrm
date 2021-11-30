export function assertNever(_obj: never, msg: string): never {
	throw new Error(msg);
}
export function invariant(condition: boolean, msg: string): asserts condition {
	if (!condition) throw new Error(msg);
}
