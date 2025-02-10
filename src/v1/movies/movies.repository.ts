import { Inject, Injectable } from '@nestjs/common';
import { Collection, Db, Document, Filter, Sort } from 'mongodb';

import * as moviesConstants from './movies.constants';
import { EmbeddedMovie } from './movies.types';

@Injectable()
export class MoviesRepository {
  constructor(
    @Inject(moviesConstants.MOVIES_COLLECTION)
    private readonly collection: Collection<EmbeddedMovie>,
  ) {}
  /**
   * Searches for movies based on the provided embedding vector and filter criteria.
   * @param {number[]} vector - The embedding vector for the search query.
   * @param {Filter<EmbeddedMovie>} $match - The filter criteria for the search.
   * @returns {Promise<Document[]>} - A promise that resolves to an array of documents matching the search criteria.
   */
  async searchMovies(
    vector: number[],
    $match: Filter<EmbeddedMovie>,
    $sort?: Sort,
  ): Promise<EmbeddedMovie[]> {
    const pipeline: Document[] = [
      {
        $vectorSearch: {
          index: moviesConstants.MOVIES_VECTOR_INDEX,
          path: moviesConstants.MOVIES_VECTOR_PATH,
          queryVector: vector,
          numCandidates: moviesConstants.MOVIES_VECTOR_NUM_CANDIDATES,
          limit: moviesConstants.MOVIES_VECTOR_LIMIT,
          similarity: moviesConstants.MOVIES_VECTOR_SIMILARITY,
        },
      },
      {
        $match,
      },
      {
        $project: {
          title: 1,
          plot: 1,
          score: { $meta: moviesConstants.MOVIES_VECTOR_SEARCH_SCORE },
        },
      },
    ];

    if ($sort) {
      pipeline.push({ $sort });
    }

    return (await this.collection
      .aggregate(pipeline)
      .limit(10)
      .toArray()) as EmbeddedMovie[];
  }
}
