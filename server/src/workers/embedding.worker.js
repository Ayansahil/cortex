import { Worker } from 'bullmq';
import Redis from 'ioredis';
import config from '../core/config/env.config.js';
import { Item, Embedding } from '../core/database/models/index.js';
import { generateEmbedding } from '../utils/embedding.util.js';

const redisConnection = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password || undefined,
  maxRetriesPerRequest: null,
});

const embeddingWorker = new Worker(
  config.workers.embeddingQueue,
  async (job) => {
    try {
      const { itemId } = job.data;

      const item = await Item.findById(itemId);

      if (!item) {
        throw new Error('Item not found');
      }

      const textContent = item.title + ' ' + (item.excerpt || '') + ' ' + (item.content || '');

      const vector = await generateEmbedding(textContent);

      let embedding = await Embedding.findOne({ item: itemId });

      if (embedding) {
        embedding.vector = vector;
        embedding.textContent = textContent;
        await embedding.save();
      } else {
        embedding = new Embedding({
          item: itemId,
          user: item.user,
          vector,
          textContent,
          model: config.openai.embeddingModel,
          dimensions: config.openai.embeddingDimensions,
        });
        await embedding.save();
      }

      item.embeddingId = embedding._id;
      await item.save();

      console.log('Completed embedding for item');

      return { success: true, itemId };
    } catch (error) {
      console.error('Error embedding item:', error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 3,
  }
);

embeddingWorker.on('completed', (job) => {
  console.log('Embedding job completed');
});

embeddingWorker.on('failed', (job, err) => {
  console.log('Embedding job failed:', err.message);
});

export default embeddingWorker;
