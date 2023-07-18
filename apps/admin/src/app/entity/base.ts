import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn({ name: 'createdAt' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  public updatedAt: Date;
}
