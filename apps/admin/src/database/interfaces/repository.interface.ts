export abstract class Repository<M> {
  public abstract delete(id: string): Promise<boolean>;

  public abstract create(data: Partial<M>): Promise<any>;
}
