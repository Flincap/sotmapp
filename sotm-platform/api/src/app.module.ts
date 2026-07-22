import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SpeakersController } from './speakers/speakers.controller';
import { SpeakersService } from './speakers/speakers.service';
import { SpeakersModule } from './speakers/speakers.module';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { SeriesModule } from './series/series.module';
import { SpecialMeetingsModule } from './special-meetings/special-meetings.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Babafemi:gltsermonlibpass@cluster0.ccev3sf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    MessagesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SpeakersModule,
    AuthModule,
    AdminsModule,
    SeriesModule,
    SpecialMeetingsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
