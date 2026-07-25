import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CranesModule } from './modules/cranes/cranes.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ContactModule } from './modules/contact/contact.module';
import { BlogModule } from './modules/blog/blog.module';
import { ServicesPageModule } from './modules/services-page/services-page.module';
import { MailModule } from './modules/mail/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get('NODE_ENV') === 'production';
        const sslEnabled = config.get('DB_SSL') === 'true';
        return {
          type: 'mysql',
          host: config.get('DB_HOST', 'localhost'),
          port: config.get<number>('DB_PORT', 3306),
          database: config.get('DB_NAME', 'soloma_db'),
          username: config.get('DB_USER', 'soloma_user'),
          password: config.get('DB_PASSWORD', ''),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
          synchronize: !isProd,
          logging: !isProd,
          charset: 'utf8mb4',
          ...(sslEnabled && {
            ssl: { rejectUnauthorized: true },
            extra: { ssl: { rejectUnauthorized: true } },
          }),
        };
      },
    }),

    // Rate limiting global : 100 req / 60s par IP
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    AuthModule,
    UploadModule,
    MailModule,
    CranesModule,
    QuotesModule,
    ProjectsModule,
    ContactModule,
    BlogModule,
    ServicesPageModule,
  ],
  providers: [
    // Applique le rate limiting globalement
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
