import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from './dto';

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
      this.errorHandler(e);
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
      console.log(department);

      // const users = department.users.map(
      //   this.serializeUser,
      // );
      // return {
      //   ...department,
      //   users: users,
      // };
      return department;
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
      return await this.prisma.userDepartment.delete(
        {
          where: {
            userId_departmentId: {
              departmentId: departmentId,
              userId: userId,
            },
          },
        },
      );
    } catch (e) {
      return this.errorHandler(e);
    }
  }

  async editDepartmentById(
    dto: UpdateDepartmentDto,
  ) {
    try {
      const department =
        await this.prisma.department.update({
          where: {
            id: dto.id,
          },
          data: {
            title: dto.title,
          },
        });
      return department;
    } catch (e) {
      return this.errorHandler(e);
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
          include: {
            users: {
              select: {
                departmentId: true,
                userId: true,
              },
            },
          },
        });
      return department;
    } catch (e) {
      return this.errorHandler(e);
    }
  }

  errorHandler(error) {
    console.log(error);
    const errorMsg = {
      errors: undefined,
      cause: undefined,
    };
    if (error.meta.target) {
      errorMsg.errors = error.meta.target.reduce(
        (accumulator, value) => {
          return {
            ...accumulator,
            [value]: 'already used',
          };
        },
        {},
      );
    }
    if (error.meta.cause) {
      errorMsg.cause = error.meta.cause;
    }

    if (error.code === 'P2003') {
      throw new HttpException(
        { ...errorMsg },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (error.code === 'P2025') {
      throw new HttpException(
        { ...errorMsg },
        HttpStatus.NOT_FOUND,
      );
    }
    if (error.code === 'P2002') {
      throw new HttpException(
        { ...errorMsg },
        HttpStatus.FOUND,
      );
    }
    throw error;
  }
}
