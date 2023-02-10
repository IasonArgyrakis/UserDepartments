import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from './dto';
import { serializeUser } from 'passport';

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

  async getDepartmentByIdWithUsers(id: number) {
    return this.serializeDepartment(id);
  }

  async serializeDepartment(id) {
    const department =
      await this.getDepartmentById(id);
    return {
      ...department,
      users: department.users.map(
        this.serializeUser,
      ),
    };
  }

  serializeUser(user) {
    return user.user;
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
