import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './users.models';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { ReportsModule } from 'src/reports/reports.module';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';


@Module({
  imports: [MongooseModule.forFeature([{name: 'User', schema: userSchema}]),
   ReportsModule],
  controllers: [UsersController],
  providers: [
    UsersService, 
    AuthService, 
  ]
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(CurrentUserMiddleware).forRoutes('*')
  }
}
