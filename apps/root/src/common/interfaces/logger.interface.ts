export abstract class Logger {
  public abstract log(...args: any[]): void;

  public abstract debug(...args: any[]): void;
}
