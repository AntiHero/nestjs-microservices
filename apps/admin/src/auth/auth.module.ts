import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AdminEntity } from '../entity/admin.entity';
import { AdminRepository } from '../database/admin.repository';
import { AbstractRepository } from '../database/abstract.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  providers: [
    AuthResolver,
    AuthService,
    { provide: AbstractRepository, useClass: AdminRepository },
  ],
  exports: [AuthService, AbstractRepository],
})
export class AuthModule {}
