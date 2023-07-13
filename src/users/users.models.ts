import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose';
import { Exclude } from 'class-transformer';
import { Report } from 'src/reports/reports.models';

@Schema()
export class User{
 @Prop({required: true})
 email: string;
  
 @Prop({required: true})
 //@Exclude()
 password: string;
  id: any;

  @Prop({default: true})
  admin: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Report'})
  report: Report[]
}

export const userSchema = SchemaFactory.createForClass(User)