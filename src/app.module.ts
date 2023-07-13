import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/users.models';
import { Report } from './reports/reports.models';
const cookieSession = require('cookie-session')


@Module({
  imports: [
    UsersModule,
    ReportsModule,
    MongooseModule.forRoot(
      'mongodb+srv://melinashakya20:r3acRhUr5EzbJosM@cluster0.pegssrg.mongodb.net/mycv?retryWrites=true&w=majority'
    ),
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      }),
    }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(cookieSession({
      keys: ['asdfasdf'],
    })).forRoutes('*');
  }
}
