import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from './reports.models';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/users.models';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectModel('Report') private readonly reportModel: Model<Report>){}

  
  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return this.reportModel
      .aggregate([
        {
          $match: {
            make: make,
            model: model,
            lng: { $gte: lng - 5, $lte: lng + 5 },
            lat: { $gte: lat - 5, $lte: lat + 5 },
            year: { $gte: year - 3, $lte: year + 3 },
            approved: {$eq: true}
          },
        },
        {
          $project: {
            price: 1,
            //absMileage: { $abs: { $subtract: ['$mileage', mileage] } },
          },
        },
        { $sort: { absMileage: -1 } },
        { $limit: 3 },
      ])
      .exec();
  }
  
  async findAll(): Promise<Report[]> {
    return this.reportModel.find().populate('users').exec();
  }

  create(reportDto: CreateReportDto, user: User): Promise<Report>{
    const report = new this.reportModel(reportDto);
    report.user = user;
    return report.save().then((createdReport) => {
      const reportWithId = createdReport.toObject();
      return reportWithId;
    });
  }

  async changeApproval(id: string, approved: boolean){
    const report = await this.reportModel.findOne({_id: id});

    if(!report){ 
      throw new NotFoundException('report not found!')
    }

    report.approved = approved;
    return report.save()
  }

}
