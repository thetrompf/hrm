export class GameError extends Error {
	public constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, GameError.prototype);
	}
}
