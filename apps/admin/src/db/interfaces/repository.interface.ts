export abstract class Repository<M> {
  public abstract delete(id: string): Promise<string | null>;

  public abstract create(data: Partial<M>): Promise<any>;
}
