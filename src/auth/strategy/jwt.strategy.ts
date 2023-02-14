import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
  }) {
    try {
      const user =
        await this.prisma.user.findUnique({
          where: {
            id: payload.sub,
          },
        });
      delete user.hash;
      return user;
    } catch (error) {
      console.log(error);
      const error_obj = error.meta.target.reduce(
        (accumulator, value) => {
          return {
            ...accumulator,
            [value]: 'already used',
          };
        },
        {},
      );
      if (error.code === 'P2002') {
        throw new HttpException(
          { errors: error_obj },
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }
}
