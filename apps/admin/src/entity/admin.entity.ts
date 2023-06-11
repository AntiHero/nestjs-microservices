import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({
  name: 'admins',
})
export class Admin extends BaseEntity {
  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;
}
