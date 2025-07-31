import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import redoc from 'redoc-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Tech Challenge Blog API')
    .setDescription(
      'Documentação da API para o blog do Tech Challenge da FIAP.',
    )
    .setVersion('1.0')
    .addTag('posts', 'Operações relacionadas a postagens')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const redocOptions = {
    title: 'Tech Challenge Blog API Docs',
    specUrl: '/api-json',
    logo: {
      url: 'https://fiap.com.br/wp-content/themes/fiap/assets/images/logo/fiap-logo.svg',
      backgroundColor: '#F0F0F0',
      altText: 'FIAP Logo',
    },
  };

  app.use('/docs', redoc(redocOptions));

  await app.listen(3000);
}
bootstrap();