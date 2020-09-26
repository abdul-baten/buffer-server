import { AuthModule } from '@routes/auth/auth.module';
import { ConnectionModule } from '@routes/connection/connection.module';
import { FacebookModule } from '@routes/facebook/facebook.module';
import { InsightModule } from '@routes/insight/insight.module';
import { InstagramModule } from '@routes/instagram/instagram.module';
import { LinkedInModule } from '@routes/linkedin/linkedin.module';
import { MediaModule } from './routes/media/media.module';
import { Module } from '@nestjs/common';
import { PostModule } from '@routes/post/post.module';
import { RouterModule, Routes } from 'nest-router';
import { TwitterModule } from '@routes/twitter/twitter.module';
import { UserModule } from '@routes/user/user.module';

const routes: Routes = [
  { module: AuthModule, path: 'auth' },
  { module: ConnectionModule, path: 'connection' },
  { module: FacebookModule, path: 'facebook' },
  { module: InsightModule, path: 'insight' },
  { module: InstagramModule, path: 'instagram' },
  { module: LinkedInModule, path: 'linkedin' },
  { module: MediaModule, path: 'media' },
  { module: PostModule, path: 'post' },
  { module: TwitterModule, path: 'twitter' },
  { module: UserModule, path: 'user' },
];

@Module({
  imports: [
    AuthModule,
    ConnectionModule,
    FacebookModule,
    InsightModule,
    InstagramModule,
    LinkedInModule,
    MediaModule,
    PostModule,
    RouterModule.forRoutes(routes),
    TwitterModule,
    UserModule,
  ],
})
export class AppRoutingModule {}
