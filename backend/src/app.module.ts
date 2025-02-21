import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerConfigModule } from './auth/mailer.module';
import { EntrepriseModule } from './Module/entreprise/entreprise.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    MailerConfigModule,
    EntrepriseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
