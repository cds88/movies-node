import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { EMBEDDING_MODEL } from './embedding.constants';

/**
 * Service for interacting with the OpenAI API to get text embeddings.
 * Uses the text-embedding-ada-002 model as default.
 * Requires OpenAPI token provided in the OPEN_API_KEY environment variable.
 */
@Injectable()
export class EmbeddingService {
  constructor(private readonly openai: OpenAI) {}

  /**
   * Get the embedding vector for a given text.
   * @param {string} text - The input text to be embedded.
   * @returns {Promise<number[]>} - The embedding vector as an 1536 length array of numbers.
   * @throws {Error} - Throws an error if the OpenAI API request fails.
   */
  async getEmbedding(text: string): Promise<number[]> {
    const { data } = await this.openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });

    return data[0].embedding;
  }
}
