import { AuthModule } from '@routes/auth/auth.module';
import { ConnectionModule } from '@routes/connection/connection.module';
import { Module } from '@nestjs/common';
import { PostModule } from '@routes/post/post.module';
import { RouterModule, Routes } from 'nest-router';
import { UserModule } from '@routes/user/user.module';

const routes: Routes = [
  {
    path: 'auth',
    module: AuthModule,
  },
  {
    path: 'connection',
    module: ConnectionModule,
  },
  {
    path: 'post',
    module: PostModule,
  },
  {
    path: 'user',
    module: UserModule,
  },
];

@Module({
  imports: [
    AuthModule,
    ConnectionModule,
    PostModule,
    RouterModule.forRoutes(routes),
  ],
})
export class AppRoutingModule {}
