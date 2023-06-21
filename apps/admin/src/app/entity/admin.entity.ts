import { Column, Entity } from 'typeorm';

import { BaseEntity }     from './base';

@Entity({
  name: 'admins',
})
export class AdminEntity extends BaseEntity {
  @Column()
  public username: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;
}
