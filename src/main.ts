import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';

// আপনার তৈরি করা ডাইনামিক ইন্টারসেপ্টর এবং সার্ভিসগুলোর সঠিক পাথ দিন
import { DynamicTranslationInterceptor } from './common/interceptors/dynamic-translation.interceptor';
import { PrismaService } from './common/prisma/prisma.service'; 
import { TranslationService } from './common/services/translation.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 🛠️ ডিপেন্ডেন্সি ইনজেকশন হ্যান্ডেল করে গ্লোবাল ইন্টারসেপ্টর সেটআপ
  const prismaService = app.get(PrismaService);
  const translationService = app.get(TranslationService);
  app.useGlobalInterceptors(new DynamicTranslationInterceptor(prismaService, translationService));

  // CORS configuration
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:3004",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
      "https://admin.motorspot.app",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Diegovillariber Backend Server')
    .addBearerAuth()
    .addGlobalParameters({
      name: 'Accept-Language',
      in: 'header',
      required: false,
      description: 'Language code (e.g., en, es)',
      schema: { type: 'string', default: 'en' },
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT! || 5000;
  console.log(`Server Running on port: ${port}`);
  await app.listen(process.env.PORT ?? port);
}

bootstrap();