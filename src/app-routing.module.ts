import { AuthModule } from '@routes/auth/auth.module';
import { ConnectionModule } from '@routes/connection/connection.module';
import { MediaModule } from './routes/media/media.module';
import { Module } from '@nestjs/common';
import { PostModule } from '@routes/post/post.module';
import { RouterModule, Routes } from 'nest-router';
import { UserModule } from '@routes/user/user.module';

const routes: Routes = [
  {
    module: AuthModule,
    path: 'auth',
  },
  {
    module: ConnectionModule,
    path: 'connection',
  },
  {
    module: PostModule,
    path: 'post',
  },
  {
    module: UserModule,
    path: 'user',
  },
  {
    module: MediaModule,
    path: 'media',
  },
];

@Module({
  imports: [AuthModule, ConnectionModule, MediaModule, PostModule, RouterModule.forRoutes(routes), UserModule],
})
export class AppRoutingModule {}
