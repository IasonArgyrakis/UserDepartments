import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import {
  AuthDto,
  RegisterAuthDto,
} from '../src/auth/dto';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from '../src/department/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto';

function test_without_each_key(original) {
  const prop_names = Object.keys(original);
  prop_names.forEach((current_key) => {
    const copy = { ...original };
    delete copy[current_key];
    it(`should throw if ${current_key} is missing`, () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody(copy)
        .expectStatus(400);
    });
  });
}

function test_segment(
  name: string,
  model: object,
  endpoint: string,
  storage: { name: string; path: string },
  expectStatus: number,
) {
  describe(name, () => {
    test_without_each_key(model);
    console.log({ ...model });
    it(`should ${name}`, () => {
      return pactum
        .spec()
        .post(endpoint)
        .withBody({ ...model })
        .expectStatus(expectStatus)
        .stores(storage.name, storage.path);
    });
  });
}

const user_1: RegisterAuthDto = {
  email: 'jason@gmail.com',
  password: '123',
  afm: 'user_1_afm',
  firstName: 'Iason',
  lastName: 'Argyrakis',
};

const user_2: RegisterAuthDto = {
  email: 'John@gmail.com',
  password: '123',
  afm: 'user_2_afm',
  firstName: 'John',
  lastName: 'Doe',
};

const departmments = [
  { title: 'Acounting' },
  { title: 'Development' },
  { title: 'HR' },
];

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl(
      'http://localhost:3333',
    );
  });

  afterAll(() => {
    prisma.cleanDb();
    app.close();
  });

  describe('Auth', () => {
    test_segment(
      'Register user 1',
      user_1,
      '/auth/signup',
      {
        name: 'user_1_signup',
        path: '',
      },
      201,
    );

    test_segment(
      'Register user 2',
      user_2,
      '/auth/signup',
      {
        name: 'user_2_signup',
        path: '',
      },
      201,
    );

    test_segment(
      'Login User 1',
      {
        email: user_1.email,
        password: user_1.password,
      },
      '/auth/signin',
      {
        name: 'user_1_signin',
        path: '',
      },
      200,
    );

    test_segment(
      'Login User 2',
      {
        email: user_2.email,
        password: user_2.password,
      },
      '/auth/signin',
      {
        name: 'user_2_signin',
        path: '',
      },
      200,
    );
  });

  describe('User Models', () => {
    describe('Get me (User_1)', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization:
              'Bearer $S{user_1_signin.access_token}',
          })
          .expectStatus(200)
          .expectJsonLike({
            email: user_1.email,
            lastName: user_1.lastName,
            firstName: user_1.firstName,
            afm: user_1.afm,
          });
      });
    });

    describe('Get me (User_2) (acting as User_2)', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization:
              'Bearer $S{user_2_signin.access_token}',
          })
          .expectStatus(200)
          .expectJsonLike({
            email: user_2.email,
            lastName: user_2.lastName,
            firstName: user_2.firstName,
            afm: user_2.afm,
          })
          .inspect();
      });
    });

    describe('Get  User with id:2 (acting as User_1)', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/{id}')
          .withPathParams('id', 2)
          .withHeaders({
            Authorization:
              'Bearer $S{user_1_signin.access_token}',
          })
          .expectStatus(200)
          .expectJsonLike({
            email: user_2.email,
            lastName: user_2.lastName,
            firstName: user_2.firstName,
            afm: user_2.afm,
          })
          .inspect();
      });
    });
  });

  describe('Update  User:2 info (acting as User_1)', () => {
    it('add exising email should fail', () => {
      return pactum
        .spec()
        .patch('/users/{id}')
        .withPathParams('id', 2)
        .withBody({
          email: user_1.email,
        })
        .withHeaders({
          Authorization:
            'Bearer $S{user_1_signin.access_token}',
        })
        .expectStatus(302);
    });
    it('add exising afm should fail', () => {
      return pactum
        .spec()
        .patch('/users/{id}')
        .withPathParams('id', 2)
        .withBody({
          afm: user_1.afm,
        })
        .withHeaders({
          Authorization:
            'Bearer $S{user_1_signin.access_token}',
        })
        .expectStatus(302);
    });
    it('Registering new user with existing email should fail', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({
          email: user_2.email,
          password: user_2.email,
          lastName: user_2.lastName,
          firstName: user_2.firstName,
          afm: 'other afm',
        })
        .expectStatus(403);
    });
    it('Registering new user with existing afm should fail', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({
          email: 'otheremail@gmail.com',
          password: user_2.email,
          lastName: user_2.lastName,
          firstName: user_2.firstName,
          afm: user_2.afm,
        })
        .expectStatus(403);
    });
  });
  describe('Departments', () => {
    describe('Get empty departments', () => {
      it('should get departments', () => {
        return pactum
          .spec()
          .get('/departments')
          .withHeaders({
            Authorization:
              'Bearer $S{user_1_signin.access_token}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create Department', () => {
      it('should create department', () => {
        return pactum
          .spec()
          .post('/departments')
          .withHeaders({
            Authorization:
              'Bearer $S{user_1_signin.access_token}',
          })
          .withBody(departmments[0])
          .expectStatus(201)
          .stores('department_1', '')
          .inspect();
      });

      it('create department with same name should fail', () => {
        return pactum
          .spec()
          .post('/departments')
          .withHeaders({
            Authorization:
              'Bearer $S{user_1_signin.access_token}',
          })
          .withBody(departmments[0])
          .expectStatus(302);
      });

      it('should create department', () => {
        return pactum
          .spec()
          .post('/departments')
          .withHeaders({
            Authorization:
              'Bearer $S{user_1_signin.access_token}',
          })
          .withBody(departmments[1])
          .expectStatus(201)
          .stores('department_1', '');
      });
    });
    describe('Add To Department', () => {
      it('should add user to department', () => {
        return pactum
          .spec()
          .put('/departments/{id}/user/{userId}')
          .withPathParams('id', 1)
          .withPathParams('userId', 1)
          .withHeaders({
            Authorization:
              'Bearer $S{user_1_signin.access_token}',
          })
          .expectStatus(200);
      });

      it('add user to department again should fail', () => {
        return pactum
          .spec()
          .put('/departments/{id}/user/{userId}')
          .withPathParams('id', 1)
          .withPathParams('userId', 1)
          .withHeaders({
            Authorization:
              'Bearer $S{user_1_signin.access_token}',
          })
          .expectStatus(302);
      });

      it('should remove user from department', () => {
        return pactum
          .spec()
          .delete(
            '/departments/{id}/user/{userId}',
          )
          .withPathParams('id', 1)
          .withPathParams('userId', 1)
          .withHeaders({
            Authorization:
              'Bearer $S{user_1_signin.access_token}',
          })
          .expectStatus(200);
      });
    });

    describe('Delete Department', () => {
      it('should delete the department', () => {
        return pactum
          .spec()
          .delete('/departments/{id}')
          .withPathParams('id', 1)
          .withHeaders({
            Authorization:
              'Bearer $S{user_1_signin.access_token}',
          })
          .expectStatus(200);
      });
    });
  });

  //
  // describe('Get User_2', () => {
  //   it('should get current user', () => {
  //     return pactum
  //       .spec()
  //       .get('/users/me')
  //       .withHeaders({
  //         Authorization:
  //           'Bearer $S{user_1_signin.access_token}',
  //       })
  //       .expectStatus(200)
  //       .inspect();
  //   });
  // });
  //
  // describe('Edit user', () => {
  //   it('should edit user', () => {
  //     const dto: EditUserDto = {
  //       firstName: 'Other',
  //       email: 'jason@gmail.com',
  //     };
  //     return pactum
  //       .spec()
  //       .patch('/users/{id}')
  //       .withPathParams(
  //         'id',
  //         '$S{currentUser.id}',
  //       )
  //       .withHeaders({
  //         Authorization: 'Bearer $S{userAt}',
  //       })
  //       .withBody(dto)
  //       .expectStatus(200);
  //   });
  // });

  //

  //

  //
  // describe('Edit department by id', () => {
  //   it('should edit department by id', () => {
  //     const dto: UpdateDepartmentDto = {
  //       title: 'Accounting & Logistics',
  //     };
  //     return pactum
  //       .spec()
  //       .patch('/departments/{id}')
  //       .withPathParams('id', '$S{department.id}')
  //       .withHeaders({
  //         Authorization: 'Bearer $S{userAt}',
  //       })
  //       .withBody(dto)
  //       .expectStatus(200)
  //       .expectBodyContains('$S{department.id}')
  //       .inspect();
  //   });
  // });
  //
  // describe('Add user to department ', () => {
  //   it('should add user to department', () => {
  //     const dto: UpdateDepartmentDto = {
  //       title: 'Accounting & Logistics',
  //     };
  //     return pactum
  //       .spec()
  //       .patch('/departments/{id}/add/{userId}')
  //       .withPathParams('id', '$S{department.id}')
  //       .withPathParams(
  //         'userId',
  //         '$S{currentUser.id}',
  //       )
  //       .withHeaders({
  //         Authorization: 'Bearer $S{userAt}',
  //       })
  //       .withBody(dto)
  //       .expectStatus(200)
  //       .expectBodyContains('$S{department.id}')
  //       .inspect();
  //   });
  // });

  // describe('Bookmarks', () => {
  //   describe('Get empty bookmarks', () => {
  //     it('should get bookmarks', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(200)
  //         .expectBody([]);
  //     });
  //   });
  //
  //   describe('Create bookmark', () => {
  //     const dto: CreateBookmarkDto = {
  //       title: 'First Bookmark',
  //       link: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
  //     };
  //     it('should create bookmark', () => {
  //       return pactum
  //         .spec()
  //         .post('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .withBody(dto)
  //         .expectStatus(201)
  //         .stores('bookmarkId', 'id');
  //     });
  //   });
  //
  //   describe('Get bookmarks', () => {
  //     it('should get bookmarks', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(200)
  //         .expectJsonLength(1);
  //     });
  //   });
  //
  //   describe('Get bookmark by id', () => {
  //     it('should get bookmark by id', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(200)
  //         .expectBodyContains('$S{bookmarkId}');
  //     });
  //   });
  //
  //   describe('Edit bookmark by id', () => {
  //     const dto: EditBookmarkDto = {
  //       title:
  //         'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
  //       description:
  //         'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
  //     };
  //     it('should edit bookmark', () => {
  //       return pactum
  //         .spec()
  //         .patch('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .withBody(dto)
  //         .expectStatus(200)
  //         .expectBodyContains(dto.title)
  //         .expectBodyContains(dto.description);
  //     });
  //   });
  //
  //   describe('Delete bookmark by id', () => {
  //     it('should delete bookmark', () => {
  //       return pactum
  //         .spec()
  //         .delete('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(204);
  //     });
  //
  //     it('should get empty bookmarks', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .expectStatus(200)
  //         .expectJsonLength(0);
  //     });
  //   });
  // });
});
