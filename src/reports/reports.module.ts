import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, reportSchema } from './reports.models';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Report', schema: reportSchema}]),
  forwardRef(() => UsersModule)
  ],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
