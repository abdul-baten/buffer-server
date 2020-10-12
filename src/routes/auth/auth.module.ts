import { AuthController } from './controller/auth.controller';
import { AuthFacade } from './facade/auth.facade';
import { AuthService } from './service/auth.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from '@utils';
import { UserHelperService } from '@helpers';
import { UserSchema } from '@schemas';

@Module({
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema }
    ])
  ],
  providers: [AuthFacade, AuthService, TokenService, UserHelperService]
})
export class AuthModule {}
