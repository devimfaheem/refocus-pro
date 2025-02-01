import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('User Api')
    .setDescription('Assignment')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { Handler } from 'aws-lambda';
// import * as express from 'express';
// import * as serverless from 'serverless-http';
// import * as dotenv from 'dotenv';
// dotenv.config();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const expressApp = express();

//   // Enable NestJS to use Express
//   app.use(expressApp);

//   await app.init();

//   // Wrap the Express app for Lambda
//   const handler: Handler = serverless(expressApp);
//   return handler;
// }

// // Expose the handler for Lambda
// export const handler = bootstrap().then((handler) => handler);
