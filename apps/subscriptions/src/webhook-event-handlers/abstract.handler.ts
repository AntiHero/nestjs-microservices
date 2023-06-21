export abstract class Handler {
  protected nextHandler: Handler | null = null;

  public next(handler: Handler | null): Handler | null {
    this.nextHandler = handler;

    return this.nextHandler;
  }

  public async handle(event: any): Promise<void | null | boolean> {
    try {
      const handled = await this.doHandle(event);
      if (!handled) return;

      return this.nextHandler?.handle(event) || null;
    } catch (error) {
      console.log(error);

      return;
    }
  }

  protected abstract doHandle(event: any): Promise<boolean>;
}
