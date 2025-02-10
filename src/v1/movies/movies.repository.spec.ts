import { Test, TestingModule } from '@nestjs/testing';
import { Db, Collection } from 'mongodb';
import { MoviesRepository } from './movies.repository';
import * as moviesConstants from './movies.constants';
import { EmbeddedMovie } from './movies.types';

describe('MoviesRepository', () => {
  let repository: MoviesRepository;
  let db: Db;
  let collection: Collection<EmbeddedMovie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesRepository,
        {
          provide: Db,
          useValue: {
            collection: jest.fn().mockReturnValue({
              aggregate: jest.fn().mockReturnThis(),
              limit: jest.fn().mockReturnThis(),
              toArray: jest.fn(),
            }),
          },
        },
        {
          provide: moviesConstants.MOVIES_COLLECTION,
          useValue: {
            aggregate: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            toArray: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<MoviesRepository>(MoviesRepository);
    db = module.get<Db>(Db);
    collection = module.get<Collection<EmbeddedMovie>>(
      moviesConstants.MOVIES_COLLECTION,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('searchMovies', () => {
    it('should return an array of movies', async () => {
      const vector = [1, 2, 3];
      const match = { title: 'Inception' };
      const movies = [
        {
          title: 'Inception',
          plot: 'A mind-bending thriller',
          plot_embedding: [1, 2, 3],
        },
      ];

      (
        collection.aggregate().limit(3).toArray as jest.Mock
      ).mockResolvedValueOnce(movies);

      const result = await repository.searchMovies(vector, match);
      expect(result).toEqual(movies);
      expect(collection.aggregate).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should return an empty array if no movies found', async () => {
      const vector = [1, 2, 3];
      const match = { title: 'Nonexistent Movie' };

      (
        collection.aggregate().limit(3).toArray as jest.Mock
      ).mockResolvedValueOnce([]);

      const result = await repository.searchMovies(vector, match);
      expect(result).toEqual([]);
      expect(collection.aggregate).toHaveBeenCalledWith(expect.any(Array));
    });
  });
});
