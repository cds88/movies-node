import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { QueryBus } from '@nestjs/cqrs';
import { Throttle } from '@nestjs/throttler';
import { GetMoviesQuery } from './movies.queries/get-movies.query';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { YearValidationPipe } from './movies.validations/year-validation.pipe';
import { PlotValidationPipe } from './movies.validations/plot-validation.pipe';
import { getCacheKey } from './movies.helpers';

@ApiTags('Search')
@Controller({ path: 'movies', version: '1' })
export class MoviesController {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  @Throttle()
  @ApiOperation({ summary: 'Search for movies' })
  @ApiResponse({ status: 200, description: 'Successful search' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiQuery({
    name: 'plot',
    type: String,
    description: 'Query string for search',
    required: false,
  })
  @ApiQuery({
    name: 'year',
    type: Number,
    description: 'Year for filtering movies',
    required: false,
  })
  async search(
    @Query('plot', new PlotValidationPipe()) plot: string,
    @Query('year', new YearValidationPipe()) year: number,
    @Res() res: Response,
  ) {
    try {
      const cacheKey = getCacheKey(plot, year);
      const cachedResults = await this.cacheManager.get(cacheKey);
      if (cachedResults) {
        res.setHeader('X-Cache-Hit', 'true');
        return res.json(cachedResults);
      }

      const query = new GetMoviesQuery(plot, year);
      const results = await this.queryBus.execute(query);

      await this.cacheManager.set(cacheKey, results);

      res.setHeader('X-Cache-Hit', 'false');
      res.status(HttpStatus.OK).json(results);
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal Server Error' });
    }
  }
}
