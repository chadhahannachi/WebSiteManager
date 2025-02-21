import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret:  process.env.JWT_SECRET, // à remplacer par une clé sécurisée
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, secure: false }, // Sécurisez selon vos besoins
    }),
  );
  app.enableCors({
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(5000);
}
bootstrap();
