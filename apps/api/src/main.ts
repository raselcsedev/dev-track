// import { NestFactory } from '@nestjs/core';
// import { AppModule, ObserveInstrument } from './app.module.js';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, {
//     instrument: ObserveInstrument,
//   });
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       transform: true,
//     }),
//   );
//   await app.listen(process.env.PORT ?? 3000);
// }
// await bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { TransformResponseInterceptor } from './common/interceptors/transform-response/transform-response.interceptor.js';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter.js';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
