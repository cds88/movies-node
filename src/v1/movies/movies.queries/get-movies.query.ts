import { IQuery } from '@nestjs/cqrs';

/**
 * Query object for fetching movies based on plot and year.
 */
export class GetMoviesQuery implements IQuery {
  /**
   * Creates an instance of GetMoviesQuery.
   * @param {string} [plot] - The plot string for search. If plot is empty the default vector from data folder is passed to the vector search
   * @param {number} [year] - The year for filtering movies. If empty defaults to year 1950
   */
  constructor(
    public readonly plot?: string,
    public readonly year?: number,
  ) {}
}
