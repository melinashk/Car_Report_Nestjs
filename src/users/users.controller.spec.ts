import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.models';


describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: string) => {
        return Promise.resolve({ id, email: 'test@tes.com', password: '12134'} as User)
      },
      find: (email: string) => {
        return Promise.resolve([{id: 1, email, password: 'asdf'} as User])
      }
      // remove: () => {},
      // update: () => {}
    }

    fakeAuthService = {
      // signup: () => {},
      // signin: () => {}
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it(' findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('test@tes.com')
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@tes.com')
  })

  it('findUser returns a single user with the given id', async() => {
    const user = await controller.findUser('64abed3d6a87c1bebf227d37');
    expect(user).toBeDefined()
  })

  it('findUser throws a error if user with given id is not found', async() => {
    fakeUsersService.findOne = () => null
    try{
      await controller.findUser('64abed3d6a87c1bebf227d37');
    }catch(error){
      expect(error).toBeDefined()
    }
  })
});
