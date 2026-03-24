import dotenv from 'dotenv';
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  apiVersion: process.env.API_VERSION || 'v1',
  
  database: {
    uri: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/knowledge-memory',
    testUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/knowledge-memory-test',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    expire: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
    model: process.env.OPENAI_MODEL || 'google/gemma-3-27b-it:free',
    embeddingModel: process.env.EMBEDDING_MODEL || 'gemini-embedding-001',
    embeddingDimensions: parseInt(process.env.EMBEDDING_DIMENSIONS) || 768,
  },

  // FIX: Gemini for embeddings
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    embeddingModel: process.env.EMBEDDING_MODEL || 'gemini-embedding-001',
    embeddingDimensions: parseInt(process.env.EMBEDDING_DIMENSIONS) || 768,
  },
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760,
    path: process.env.UPLOAD_PATH || './uploads',
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg', 'image/png', 'image/gif', 'application/pdf'
    ],
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  
  vectorSearch: {
    useMongoDBVectorSearch: process.env.USE_MONGODB_VECTOR_SEARCH === 'true',
    indexName: process.env.VECTOR_INDEX_NAME || 'vector_index',
  },
  
  workers: {
    enabled: process.env.ENABLE_WORKERS === 'true',
    taggingQueue: process.env.TAGGING_QUEUE_NAME || 'tagging-queue',
    embeddingQueue: process.env.EMBEDDING_QUEUE_NAME || 'embedding-queue',
  },
  
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY || '',
  },
};

export default config;