import { AuthModule } from '@routes/auth/auth.module';
import { ConnectionModule } from '@routes/connection/connection.module';
import { FacebookInsightModule } from '@routes/facebook-insight/facebook-insight.module';
import { FacebookModule } from '@routes/facebook/facebook.module';
import { InstagramInsightModule } from '@routes/instagram-insight/instagram-insight.module';
import { InstagramModule } from '@routes/instagram/instagram.module';
import { LinkedInModule } from '@routes/linkedin/linkedin.module';
import { MediaModule } from './routes/media/media.module';
import { Module } from '@nestjs/common';
import { PostModule } from '@routes/post/post.module';
import { RouterModule, Routes } from 'nest-router';
import { TwitterModule } from '@routes/twitter/twitter.module';
import { UserModule } from '@routes/user/user.module';

const routes: Routes = [
  { module: AuthModule,
    path: 'auth' },
  { module: ConnectionModule,
    path: 'connection' },
  { module: FacebookModule,
    path: 'facebook' },
  { module: FacebookInsightModule,
    path: 'facebook-insight' },
  { module: InstagramInsightModule,
    path: 'instagram-insight' },
  { module: InstagramModule,
    path: 'instagram' },
  { module: LinkedInModule,
    path: 'linkedin' },
  { module: MediaModule,
    path: 'media' },
  { module: PostModule,
    path: 'post' },
  { module: TwitterModule,
    path: 'twitter' },
  { module: UserModule,
    path: 'user' }
];

@Module({
  imports: [
    AuthModule,
    ConnectionModule,
    FacebookInsightModule,
    FacebookModule,
    InstagramInsightModule,
    InstagramModule,
    LinkedInModule,
    MediaModule,
    PostModule,
    RouterModule.forRoutes(routes),
    TwitterModule,
    UserModule
  ]
})
export class AppRoutingModule {}
