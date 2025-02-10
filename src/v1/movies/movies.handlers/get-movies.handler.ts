import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMoviesQuery } from '../movies.queries/get-movies.query';
import { MoviesService } from '../movies.service';

import { getDefaultEmbeddingVector } from '../movies.helpers';
import { EmbeddingService } from '../../embedding/embedding.service';
import { MOVIES_VECTOR_SEARCH_DEFAULT_YEAR } from '../movies.constants';

/**
 * Query handler for fetching movies based on plot and year.
 */
@QueryHandler(GetMoviesQuery)
export class GetMoviesHandler implements IQueryHandler<GetMoviesQuery> {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  /**
   * Executes the GetMoviesQuery.
   * Converts the plot string to an embedding vector and fetches movies based on the vector and year.
   * If the plot is empty, the default vector is used.
   * Empty year defaults to 1950.
   * @param {GetMoviesQuery} query - The query object containing the plot and year.
   * @returns {Promise<any>} - A promise that resolves to the search results.
   */
  async execute(query: GetMoviesQuery): Promise<any> {
    const { plot, year = MOVIES_VECTOR_SEARCH_DEFAULT_YEAR } = query;
    let vector: number[];

    if (plot) {
      vector = await this.embeddingService.getEmbedding(plot);
    } else {
      vector = getDefaultEmbeddingVector();
    }
    return this.moviesService.searchMovies(vector, { year: { $lt: year } });
  }
}
