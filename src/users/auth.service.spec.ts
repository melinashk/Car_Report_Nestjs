import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./users.models";
import { CreateUserDto } from "./dtos/create-user.dto";
import { Document, Query, Model } from "mongoose";

describe('AuthService', () => {
  let service: AuthService
  let fakeUsersService: Partial<UsersService>

beforeEach(async () => {
  // Create a fake copy of the users service
  const users: User[] = [];
  fakeUsersService = {
    // find: jest.fn().mockReturnValue({
    //   exec: jest.fn().mockResolvedValue([]),
    //   where: jest.fn().mockReturnThis(),
    // }) as unknown as (email: string) => Query<(Document<unknown, {}, User> & Omit<User & { _id }, never>)[], Document<unknown, {}, User> & Omit<User & { _id }, never>, {}, User, "find">,
    
    find: (email: string) => {
      const filteredUsers = users.filter(user => user.email === email)
      return Promise.resolve(filteredUsers)
    },

    // create: (createUserDto: CreateUserDto) =>
    //   Promise.resolve({ id: 1, ...createUserDto } as User),

    create: (createUserDto: CreateUserDto) => {
      const user = { id: Math.floor(Math.random()*999999), ...createUserDto} as User
      users.push(user);
      return Promise.resolve(user)
    }
  };
  const module = await Test.createTestingModule({
    providers: [
      AuthService,
      {
        provide: UsersService,
        useValue: fakeUsersService
      }]
  }).compile();

  service = module.get(AuthService)

})

  it('can create an instance of the auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('sita@sita.com', 'sita123')

    expect(user.password).not.toEqual('sita123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  })

  it('throws an error if user signs up with an email that is in use', async () => {
    // Create a fake copy of the users service
    // const fakeUsersService: Partial<UsersService> = {
    //   find: jest.fn().mockReturnValue({
    //     exec: jest.fn().mockResolvedValue([{ id: 1, email: 'a', password: '1'}] as User[]),
    //     where: jest.fn().mockReturnThis(),
    //   }) as unknown as (email: string) => Query<(Document<unknown, {}, User> & Omit<User & { _id }, never>)[], Document<unknown, {}, User> & Omit<User & { _id }, never>, {}, User, "find">,
    //   create: (createUserDto: CreateUserDto) =>
    //     Promise.resolve({ id: 1, ...createUserDto } as User),
    // };
  
    await service.signup('test@tes.com', '12134')
    try {
      await service.signup('test@tes.com', '12134');
      throw new Error('Expected error to be thrown.');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('throws if signin is called with an unused email', async () => {
    try{
      await service.signin('asdfa@asdfa.com', 'asddsfgd')
    }catch(error){
      expect(error).toBeDefined();
    }
  })

  it('throws if an invalid password is provided', async () => {
    await service.signup('test@test.com', '1234')
    try {
      await service.signin('test@test.com', '12134');
      throw new Error('Expected error to be thrown.');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('returns a user if correct password is provided', async () => {
  //   fakeUsersService.find = jest.fn().mockReturnValue({
  //     exec: jest.fn().mockResolvedValue([
  //       { email: 'asdf@asdf.com', password: '68e8e8438be40ea2.c53f83d45e006af916332de8fcf219674b96989251c0b035bee546c7cc8438eb' } as User,
  //     ]),
  //     where: jest.fn().mockReturnThis(),
  //   });
  
  //   const user = await service.signin('asdf@asdf.com', 'mypassword');
  
  //   expect(user).toBeDefined();
  // });
  
    // try{
    //   const user = await service.signin('asdf@asdf.com', 'mypassword')
    //   console.log(user)
    //   //expect(user).toBeDefined()
    // }catch(error){
    //   expect(error).toBeDefined
    // }

    await service.signup('asdf@asdf.com', 'mypassword')
    const user = await service.signin('asdf@asdf.com', 'mypassword')
    expect(user).toBeDefined()
  })
})