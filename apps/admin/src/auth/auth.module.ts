import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AdminEntity } from '../app/entity/admin.entity';
import { AdminRepository } from '../database/admin.repository';
import { SqlRepository } from '../database/interfaces/sql-repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  providers: [
    AuthResolver,
    AuthService,
    { provide: SqlRepository, useClass: AdminRepository },
  ],
  exports: [AuthService, SqlRepository],
})
export class AuthModule {}
