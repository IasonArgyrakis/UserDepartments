import { Injectable } from '@nestjs/common';
import { CreateUserDepartmentDto } from './dto/create-user-department.dto';
import { UpdateUserDepartmentDto } from './dto/update-user-department.dto';

@Injectable()
export class UserDepartmentService {
  create(
    createUserDepartmentDto: CreateUserDepartmentDto,
  ) {
    return 'This action adds a new userDepartment';
  }

  findAll() {
    return `This action returns all userDepartment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userDepartment`;
  }

  update(
    id: number,
    updateUserDepartmentDto: UpdateUserDepartmentDto,
  ) {
    return `This action updates a #${id} userDepartment`;
  }

  remove(id: number) {
    return `This action removes a #${id} userDepartment`;
  }
}
