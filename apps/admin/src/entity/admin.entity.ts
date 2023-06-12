import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base';

@Entity({
  name: 'admins',
})
export class AdminEntity extends BaseEntity {
  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
