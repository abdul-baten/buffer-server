import { AuthModule } from '@app/routes/auth/auth.module';
import { ConnectionModule } from './routes/connection/connection.module';
import { Module } from '@nestjs/common';
import { RouterModule, Routes } from 'nest-router';

const routes: Routes = [
  {
    path: 'auth',
    module: AuthModule,
  },
  {
    path: 'connection',
    module: ConnectionModule,
  },
];

@Module({
  imports: [AuthModule, RouterModule.forRoutes(routes), ConnectionModule],
})
export class AppRoutingModule {}
