import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from './dto';

import { Prisma } from '@prisma/client';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  getDepartments() {
    return this.prisma.department.findMany({
      include: {
        _count: true,
      },
    });
  }

  async createDepartment(
    dto: CreateDepartmentDto,
  ) {
    try {
      const department =
        await this.prisma.department.create({
          data: { ...dto },
        });
      return department;
    } catch (e) {
      this.errorHandler(
        e,
        new CreateDepartmentDto(),
      );
    }
  }

  async getDepartmentById(id: number) {
    try {
      const department =
        this.prisma.department.findFirst({
          where: {
            id: id,
          },
          include: {
            users: {
              select: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    afm: true,
                  },
                },
              },
            },
            _count: true,
          },
          // @todo Paginate
          // skip: 4,
          // take: 2,
        });
      return department;
    } catch (e) {
      return this.errorHandler(e);
    }
  }

  async getDepartmentByIdWithUsers(id: number) {
    return this.serializeDepartment(id);
  }

  async serializeDepartment(id) {
    try {
      const department =
        await this.getDepartmentById(id);
      if (department !== null) {
        const users = department.users.map(
          this.serializeUser,
        );
        return {
          ...department,
          users: users,
        };
      } else {
        return new HttpException(
          `Not Found `,
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (e) {
      return this.errorHandler(e);
    }
  }

  serializeUser(user) {
    return user.user;
  }

  async addUserToDepartment(
    departmentId: number,
    userId: number,
  ) {
    try {
      const department =
        await this.prisma.userDepartment.create({
          data: {
            userId: userId,
            departmentId: departmentId,
          },
        });
      return department;
    } catch (e) {
      return this.errorHandler(e);
    }
  }

  async removeUserFromDepartment(
    departmentId: number,
    userId: number,
  ) {
    try {
      const department =
        await this.prisma.userDepartment.delete({
          where: {
            userId_departmentId: {
              departmentId: departmentId,
              userId: userId,
            },
          },
        });
      return department;
    } catch (e) {
      return this.errorHandler(e);
    }
  }

  //
  // async removeUserFromDepartment(
  //   departmentId: number,
  //   userId: number,
  // ) {
  //   return this.prisma.department.update({
  //     where: {
  //       id: departmentId,
  //     },
  //     data: {
  //       users: { connect: { id: userId } },
  //     },
  //   });
  // }

  async editDepartmentById(
    departmentId: number,
    dto: UpdateDepartmentDto,
  ) {
    try {
      const department =
        await this.prisma.department.update({
          where: {
            id: departmentId,
          },
          data: {
            ...dto,
          },
        });
      return department;
    } catch (e) {
      return this.errorHandler(
        e,
        new UpdateDepartmentDto(),
      );
    }
  }

  async deleteDepartmentById(
    departmentId: number,
  ) {
    try {
      //find delete department
      const department =
        await this.prisma.department.delete({
          where: {
            id: departmentId,
          },
        });
      return department;
    } catch (e) {
      return this.errorHandler(e);
    }
  }

  errorHandler(error, info = null) {
    if (
      error instanceof
      Prisma.PrismaClientKnownRequestError
    ) {
      console.log(error);
      if (error.code === 'P2002') {
        if (info instanceof UpdateDepartmentDto) {
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
