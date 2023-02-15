import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, RegisterAuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: RegisterAuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);
    // save the new user in the db
    delete dto.password;

    try {
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          hash,
        },
      });

      return await this.signToken(
        user.id,
        user.email,
      );
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async createUser(dto: RegisterAuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);
    // save the new user in the db
    delete dto.password;
    try {
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          hash,
        },
      });
      delete user.hash;

      return user;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    // if user does not exist throw exception
    if (!user)
      throw new ForbiddenException({
        email: 'No Such User',
      });

    // compare password
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );
    // if password incorrect throw exception
    if (!pwMatches)
      throw new ForbiddenException({
        password: 'Credentials incorrect',
      });
    return this.signToken(user.id, user.email);
  }

  async;
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '1d',
        secret: secret,
      },
    );
    return {
      access_token: token,
    };
  }

  errorHandler(error) {
    console.log(error);
    const errorMsg = {
      errors: undefined,
      cause: undefined,
    };
    if (error.meta.target) {
      errorMsg.errors = error.meta.target.reduce(
        (accumulator, value) => {
          return {
            ...accumulator,
            [value]: 'already used',
          };
        },
        {},
      );
    }
    if (error.meta.cause) {
      errorMsg.cause = error.meta.cause;
    }

    if (error.code === 'P2003') {
      throw new HttpException(
        { ...errorMsg },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (error.code === 'P2025') {
      throw new HttpException(
        { ...errorMsg },
        HttpStatus.NOT_FOUND,
      );
    }
    if (error.code === 'P2002') {
      throw new HttpException(
        { ...errorMsg },
        HttpStatus.FOUND,
      );
    }
  }
}
