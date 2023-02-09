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
@Controller('department')
export class DepartmentController {
  constructor(
    private departmentService: DepartmentService,
  ) {

  }

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
  findOne(@Param('id') id: number) {
    return this.departmentService.getDepartmentById(
      id,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.editDepartmentById(
      +id,
      updateDepartmentDto,
    );
  }

  @Patch(':departmentId/add/:userId')
  addUser(
    @Param('departmentId') departmentId: string,
    @Param('userId') userId: string,
    @Body()
    updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.addUserToDepartment(
      +departmentId,
      +userId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentService.deleteDepartmentById(
      +id,
    );
  }
}
