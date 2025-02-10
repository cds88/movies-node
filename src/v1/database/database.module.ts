import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';

import { AppConfigService } from '../../config/types';

@Global()
@Module({
  providers: [
    {
      provide: MongoClient,
      useFactory: async (
        configService: AppConfigService,
      ): Promise<MongoClient> => {
        const connectionString = configService.get<string>('MONGO_URI');
        const client = new MongoClient(connectionString);
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
    {
      provide: Db,
      useFactory: async (
        client: MongoClient,
        configService: AppConfigService,
      ): Promise<Db> => {
        const dbName = configService.get<string>('MONGO_DB_NAME');
        const db = client.db(dbName);
        return db;
      },
      inject: [MongoClient, ConfigService],
    },
  ],
  exports: [MongoClient, Db],
})
export class DatabaseModule {}
