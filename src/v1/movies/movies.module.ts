import { Module } from '@nestjs/common';
import { Collection, Db } from 'mongodb';
import { EmbeddingModule } from '../embedding/embedding.module';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CqrsModule } from '@nestjs/cqrs';
import { GetMoviesHandler } from './movies.handlers/get-movies.handler';
import { MoviesRepository } from './movies.repository';
import { EmbeddedMovie } from './movies.types';
import { CacheModule } from '@nestjs/cache-manager';
import * as moviesConstants from './movies.constants';

@Module({
  imports: [
    CqrsModule,
    EmbeddingModule,
    CacheModule.register({
      ttl: moviesConstants.MOVIES_CACHE_TTL,
      max: moviesConstants.MOVIES_CACHE_MAX,
    }),
  ],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    MoviesRepository,
    {
      provide: moviesConstants.MOVIES_COLLECTION,
      useFactory: async (db: Db): Promise<Collection<EmbeddedMovie>> => {
        return db.collection(moviesConstants.MOVIES_COLLECTION_NAME);
      },
      inject: [Db],
    },
    GetMoviesHandler,
  ],
})
export class MoviesModule {}
