import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto';
import { Prisma } from '@prisma/client';
import { CreateDepartmentDto } from '../department/dto';
import { RegisterAuthDto } from '../auth/dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        afm: true,
        email: true,
        createdAt: true,
        updatedAt: true,

        departments: {
          select: {
            department: {
              select: { title: true },
            },
          },
        },
      },
      // @todo Paginate
      // skip: 4,
      // take: 2,
    });
  }

  async createUser(dto: RegisterAuthDto) {
    try {
      return await this.authService.createUser(
        dto,
      );
    } catch (e) {
      this.errorHandler(e);
    }
  }

  async editUser(dto: UserDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: dto.id,
        },
        data: {
          ...dto,
        },
      });

      delete user.hash;

      return user;
    } catch (e) {
      this.errorHandler(e);
    }
  }

  async findUser(userId: number) {
    const user = await this.prisma.user.findFirst(
      {
        where: {
          id: userId,
        },
      },
    );

    delete user.hash;

    return user;
  }

  errorHandler(error, info = null) {
    if (
      error instanceof
      Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === 'P2002') {
        if (info instanceof UserDto) {
          throw new HttpException(
            'Department name is already used',
            HttpStatus.FOUND,
          );
        }
        if (info instanceof CreateDepartmentDto) {
          throw new HttpException(
            'Department name is already used',
            HttpStatus.FOUND,
          );
        }
        throw new HttpException(
          'Already exists (Duplicate)',
          HttpStatus.FOUND,
        );
      }
      if (error.code === 'P2003') {
        throw new HttpException(
          `Wrong Data Combination `,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (error.code === 'P2025') {
        throw new HttpException(
          `Not Found`,
          HttpStatus.NOT_FOUND,
        );
      }
    }
    return error;
  }
}
