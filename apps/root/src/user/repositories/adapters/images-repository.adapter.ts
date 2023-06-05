import { Injectable } from '@nestjs/common';
import { RepositoryAdapter } from 'apps/root/src/common/adapters/repository.adapter';

@Injectable()
export abstract class ImagesRepositoryAdapter<T> extends RepositoryAdapter {
  public abstract create(id: string, payload: Partial<T>): Promise<T | null>;
}
