import { Expose, Transform } from "class-transformer";
import { User } from "src/users/users.models";



export class ReportDto {
  @Expose()
  id: string;
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  lng: number;
  @Expose()
  lat: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  mileage: number;
  @Expose()
  approved: boolean;

  @Transform(({ obj }) =>obj.user._id)
  @Expose()
  userId: string
}