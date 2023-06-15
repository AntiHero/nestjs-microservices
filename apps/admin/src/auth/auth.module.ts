import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AdminEntity } from '../app/entity/admin.entity';
import { AdminRepository } from '../database/admin.repository';
import { SqlRepository } from '../database/abstracts/sql.repository';

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
