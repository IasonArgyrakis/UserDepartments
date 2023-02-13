import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    {
      cors: {
        origin: 'http://localhost:3000',
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (
        validationErrors: ValidationError[] = [],
      ) => {
        const errors = {};
        validationErrors.forEach((item) => {
          const yourKeyVariable = item.property;
          errors[yourKeyVariable] = Object.values(
            item.constraints,
          );
        });
        return new BadRequestException({
          errors: errors,
        });
      },
    }),
  );
  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(
    app,
    config,
  );
  SwaggerModule.setup('api', app, document);
  await app.listen(3333);
}
bootstrap();
