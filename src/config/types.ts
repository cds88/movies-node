import { ConfigService } from '@nestjs/config';
export type EnvConfig = {
  MONGO_URI: string;
  MONGO_DB_NAME: string;
  MONGO_COLLECTION_NAME: string;
  OPENAI_API_KEY: string;
  PORT: number;
};
export type AppConfigService = ConfigService<EnvConfig>;
