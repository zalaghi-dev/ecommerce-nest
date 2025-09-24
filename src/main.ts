import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger/logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(new LoggerMiddleware().use.bind(new LoggerMiddleware()));
  // app.useGlobalGuards(new JwtAuthGuard());

  //!  For Using this we should remove @Res in each controller and return data
  app.useGlobalInterceptors(new ResponseInterceptor());
  // -------------- Swagger Config --------------
  const config = new DocumentBuilder()
    .setTitle('Ecommerce nest API documention')
    .setDescription('Just a simple App to understand features in nestjs')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // -------------------------------------------
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
