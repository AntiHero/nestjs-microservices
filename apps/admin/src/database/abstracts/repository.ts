export abstract class Repository<M> {
  public abstract delete(id: string): Promise<boolean>;
}
