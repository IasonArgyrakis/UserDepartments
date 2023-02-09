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
    });
  }

  async addUserToDepartment(
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
