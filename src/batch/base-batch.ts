export abstract class BaseBatch {
	public abstract run(): Promise<void>;
}