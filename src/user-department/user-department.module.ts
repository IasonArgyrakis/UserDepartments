import { Module } from '@nestjs/common';
import { UserDepartmentService } from './user-department.service';
import { UserDepartmentController } from './user-department.controller';

@Module({
  controllers: [UserDepartmentController],
  providers: [UserDepartmentService],
})
export class UserDepartmentModule {}
