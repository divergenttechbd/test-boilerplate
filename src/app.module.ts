import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';



@Module({
  imports: [UsersModule, RolesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
