// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Importe as bibliotecas

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Tech Challenge Blog API')
    .setDescription('Documentação da API para o blog do Tech Challenge da FIAP.')
    .setVersion('1.0')
    .addTag('posts', 'Operações relacionadas a postagens')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(3000);
}
bootstrap();