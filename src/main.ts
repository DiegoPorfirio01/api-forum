import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  patchNestJsSwagger();

  const configService: ConfigService<Env, true> = app.get(ConfigService);
  const port = configService.get('PORT', { infer: true });

  const config = new DocumentBuilder()
    .setTitle('API FORUM')
    .setDescription('Open API for forum')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
}
bootstrap();
