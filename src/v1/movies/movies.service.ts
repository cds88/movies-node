import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Filter, MongoClient, Sort } from 'mongodb';

import { MoviesRepository } from './movies.repository';
import { EmbeddedMovie } from './movies.types';

@Injectable()
export class MoviesService implements OnModuleDestroy {
  constructor(
    private readonly moviesRepository: MoviesRepository,
    @Inject(MongoClient) private readonly client: MongoClient,
  ) {}

  async searchMovies(
    vector: number[],
    $match: Filter<EmbeddedMovie>,
    $sort?: Sort,
  ): Promise<EmbeddedMovie[]> {
    return this.moviesRepository.searchMovies(vector, $match, $sort);
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
