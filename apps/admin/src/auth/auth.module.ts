import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AuthResolver } from './auth.resolver';
import { AdminEntity } from '../entity/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  providers: [AuthResolver],
})
export class AuthModule {}
