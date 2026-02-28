import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './common/prisma/prisma.service';
import { seedAdmin } from './common/seed/admin.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  if (process.env.AUTO_SEED === 'true') {
    const prisma = app.get(PrismaService);

    console.log('AUTO_SEED enabled. Seeding admin...');
    await seedAdmin(prisma);
    console.log('Seeding done ✅');
  }

  const config = new DocumentBuilder()
    .setTitle('Diegovillariber Backend Server')
    .addBearerAuth()
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
