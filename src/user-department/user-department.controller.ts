import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserDepartmentService } from './user-department.service';
import { CreateUserDepartmentDto } from './dto/create-user-department.dto';
import { UpdateUserDepartmentDto } from './dto/update-user-department.dto';

@Controller('user-department')
export class UserDepartmentController {
  constructor(private readonly userDepartmentService: UserDepartmentService) {}

  @Post()
  create(@Body() createUserDepartmentDto: CreateUserDepartmentDto) {
    return this.userDepartmentService.create(createUserDepartmentDto);
  }

  @Get()
  findAll() {
    return this.userDepartmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userDepartmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDepartmentDto: UpdateUserDepartmentDto) {
    return this.userDepartmentService.update(+id, updateUserDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userDepartmentService.remove(+id);
  }
}
