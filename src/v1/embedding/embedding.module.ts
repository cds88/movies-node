import { Module } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { ConfigService } from '@nestjs/config';

import OpenAI from 'openai';
import { AppConfigService } from 'src/config/types';
@Module({
  providers: [
    EmbeddingService,
    {
      provide: OpenAI,
      useFactory: (configService: AppConfigService) => {
        const openAi = new OpenAI({
          apiKey: configService.get<string>('OPENAI_API_KEY'),
        });
        return openAi;
      },
      inject: [ConfigService],
    },
  ],
  exports: [EmbeddingService],
})
export class EmbeddingModule {}
