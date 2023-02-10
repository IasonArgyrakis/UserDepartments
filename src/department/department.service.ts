import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from './dto';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  getDepartments() {
    return this.prisma.department.findMany();
  }

  async createDepartment(
    dto: CreateDepartmentDto,
  ) {
    return this.prisma.department.create({
      data: { ...dto },
    });
  }

  async getDepartmentById(id: number) {
    return this.prisma.department.findFirst({
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
      },
    });
  }
  async getDepartmentBById(id: number) {
    return this.prisma.department.findFirst({
      where: {
        id: id,
      },
      select: {
        users: true,
      },
    });
  }

  async getDepartmentByIdWithUsers(id: number) {
    return this.serilizeDepratment(id);
  }

  async serilizeDepratment(id) {
    const department =
      await this.getDepartmentById(id);
    const user_ids: Array<number> =
      department.users.map(this.makeUserIdArray);
    const department_users =
      await this.prisma.user.findMany({
        where: {
          id: { in: user_ids },
        },
      });
    return {
      ...department,
      users: department_users,
    };
  }

  makeUserIdArray(relation) {
    return relation.userId;
  }

  async addUserToDepartment(
    departmentId: number,
    userId: number,
  ) {
    return this.prisma.userDepartment.create({
      data: {
        userId: userId,
        departmentId: departmentId,
      },
    });
  }

  async removeUserFromDepartment(
    departmentId: number,
    userId: number,
  ) {
    return this.prisma.department.update({
      where: {
        id: departmentId,
      },
      data: {
        users: { connect: { id: userId } },
      },
    });
  }

  async editDepartmentById(
    departmentId: number,
    dto: UpdateDepartmentDto,
  ) {
    return this.prisma.department.update({
      where: {
        id: departmentId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteDepartmentById(
    departmentId: number,
  ) {
    return this.prisma.department.delete({
      where: {
        id: departmentId,
      },
    });
  }
}
