import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { DatabaseModule } from './database/database.module';
import { EmbeddingModule } from './embedding/embedding.module';

@Module({
  imports: [MoviesModule, DatabaseModule, EmbeddingModule],
})
export class AppV1Module {}
