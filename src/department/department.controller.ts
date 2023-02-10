import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { DepartmentService } from './department.service';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from './dto';

//@UseGuards(JwtGuard)
@Controller('departments')
export class DepartmentController {
  constructor(
    private departmentService: DepartmentService,
  ) {}

  @Get()
  findAll() {
    return this.departmentService.getDepartments();
  }
  @Post()
  create(
    @Body()
    createDepartmentDto: CreateDepartmentDto,
  ) {
    return this.departmentService.createDepartment(
      createDepartmentDto,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    departmentId: number,
  ) {
    return this.departmentService.getDepartmentById(
      departmentId,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.editDepartmentById(
      id,
      updateDepartmentDto,
    );
  }

  @Patch(':id/add/:userId')
  addUser(
    @Param('id', ParseIntPipe)
    id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.departmentService.addUserToDepartment(
      id,
      userId,
    );
  }

  @Patch(':id/remove/:userId')
  removeUser(
    @Param('id', ParseIntPipe)
    id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.departmentService.removeUserFromDepartment(
      id,
      userId,
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe)
    departmentId: number,
  ) {
    return this.departmentService.deleteDepartmentById(
      departmentId,
    );
  }
}
