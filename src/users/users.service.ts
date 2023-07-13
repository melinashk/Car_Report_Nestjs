import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.models';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = []

  constructor(@InjectModel('User') private readonly userModel: Model<User>){}
    
  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('reports').exec();
  }

  async create(createUserDto: CreateUserDto): Promise<User>{
    const createdUser = new this. userModel(createUserDto);
    return createdUser.save()
  }
  
  findOne(id: string): Promise<User | null>{
    if(!id){
      return null
    }
    return this.userModel.findOne({ _id: id })
  }

  async find(email: string): Promise<User[]> {
    const users = await this.userModel.find({ email }).exec();
    return users;
  }

  async update(id: string, attrs: Partial<User>): Promise<User | null>{
    const updatedUser =await this.userModel.findOneAndUpdate({_id: id}, attrs, {new: true});

    if(!updatedUser) {
       throw new NotFoundException('User not found')
    }
    return updatedUser
  }

  async remove(id: string){
    const user = await this.findOne(id)

    if(!user){
      throw new NotFoundException('User not found');
    }

    return this.userModel.findByIdAndRemove(user)
  }
}
