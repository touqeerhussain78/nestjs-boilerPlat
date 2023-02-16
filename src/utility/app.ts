import {
  ValidationError,
  BadRequestException,
  ValidationPipe,
  INestApplication,
} from '@nestjs/common';
import { AppModule } from '@/app.module';
import { Test } from '@nestjs/testing';
import { urlencoded, json } from 'express';
import { TransformInterceptor } from '@/interceptors/transform.interceptor';
import { ErrorsInterceptor } from '@/interceptors/errors.interceptor';

interface Error {
  name: string;
  error: string;
}
type Errors = Error[];

export const bootstrapApp = (app: INestApplication) => {
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.setGlobalPrefix(process.env.APP_BASE_PATH, {
    exclude: ['/'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const errMsg: Errors = [];
        errors.forEach((err) => {
          errMsg.push({
            name: err.property,
            error: Object.values(err.constraints)[0],
          });
        });
        return new BadRequestException({
          errors: errMsg,
          message: 'Bad Request',
          statusCode: 400,
        });
      },
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new ErrorsInterceptor());
  app.enableCors();
};

export const testingModule = async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const testingApp = moduleFixture.createNestApplication();
  bootstrapApp(testingApp);
  await testingApp.init();
  return { testingApp, moduleFixture };
};
