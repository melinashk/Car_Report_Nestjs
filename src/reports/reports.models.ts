import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
import { User } from 'src/users/users.models';


@Schema()
export class Report{
 @Prop({default: false})
 approved: boolean;
 
 @Prop({required: true})
 price: number;

 @Prop({required: true})
 make: string;

 @Prop({required: true})
 model: string;

 @Prop({required: true})
 year: number;

 @Prop({required: true})
 lng: number;

 @Prop({required: true})
 lat: number;

 @Prop({required: true})
 mileage: number;

 @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
 user: User

}

export const reportSchema = SchemaFactory.createForClass(Report)