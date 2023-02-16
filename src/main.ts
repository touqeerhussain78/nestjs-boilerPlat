import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@/app.module';
import { bootstrapApp } from '@/utility/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  bootstrapApp(app);

  if (process.env.APP_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('User Authentication Application')
      .setDescription('User Authentication API documentation')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
        },
        'admin',
      )
      .addBearerAuth(
        {
          type: 'http',
        },
        'user',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-documentation', app, document);
  }

  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
