import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),

        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,

        connectionErrorFactory(error) {
          console.error('MongoDB connection error:', error);
          process.exit(1);
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MongodbModule {}
