import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserDto } from './dto';
import { UserService } from './user.service';
import { RegisterAuthDto } from '../auth/dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get()
  async findAll() {
    return this.userService.serializedUsers();
  }

  @Get(':id')
  findUser(
    @Param('id', ParseIntPipe)
    userId: number,
  ) {
    return this.userService.findUser(userId);
  }

  @Post()
  createUser(@Body() dto: RegisterAuthDto) {
    return this.userService.createUser(dto);
  }

  @Put()
  editUser(@Body() dto: UserDto) {
    return this.userService.editUser(dto);
  }
}
