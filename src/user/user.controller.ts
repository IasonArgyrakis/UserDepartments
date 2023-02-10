import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get()
  findAll() {
    return this.userService.getUsers();
  }

  @Get(':id')
  findUser(
    @Param('id', ParseIntPipe)
    userId: number,
  ) {
    return this.userService.findUser(userId);
  }

  @Patch(':id')
  editUser(
    @Param('id', ParseIntPipe)
    userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }
}
