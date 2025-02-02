import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { createServer, proxy } from 'aws-serverless-express';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
const expressApp = express();
let server: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  app.enableCors();
  if (process.env.LAMBDA_TASK_ROOT) {
    // Running in AWS Lambda
    await app.init();
    Logger.log('Starting AWS Lambda Server');
    server = createServer(expressApp);
  } else {
    // Running locally
    const config = new DocumentBuilder()
      .setTitle('User Api')
      .setDescription('Assignment')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
    app.setGlobalPrefix('dev');
    const port = process.env.PORT || 3000;
    await app.listen(port);
    Logger.log(`🚀 Server running locally on http://localhost:${port}`);
  }
}

bootstrap();

export const handler = async (event: any, context: any) => {
  if (!server) {
    await bootstrap();
  }
  return proxy(server, event, context, 'PROMISE').promise;
};

