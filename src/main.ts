import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sécurité HTTP headers
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Prefix global
  const prefix = process.env.API_PREFIX || 'v1';
  app.setGlobalPrefix(prefix);

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );

  // Intercepteur de réponse standardisé
  app.useGlobalInterceptors(new TransformInterceptor());

  // Filtre d'exceptions global
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger — uniquement hors production
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('SOLOMA SUARL API')
      .setDescription('API REST — Manutention Portuaire & Levage Industriel')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));
    console.log(`📚 Swagger disponible sur http://localhost:${port}/docs`);
  }

  // Health check léger pour Render
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

  const port = process.env.PORT || 3001;
  // 0.0.0.0 requis pour Render (et Docker)
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 SOLOMA API démarrée sur http://0.0.0.0:${port}/${prefix}`);
}
bootstrap();
