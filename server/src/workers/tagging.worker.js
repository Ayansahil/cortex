import { Worker } from 'bullmq';
import Redis from 'ioredis';
import config from '../core/config/env.config.js';
import { Item } from '../core/database/models/index.js';
import { generateTags } from '../utils/tagging.util.js';

const redisConnection = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password || undefined,
  maxRetriesPerRequest: null,
});

const taggingWorker = new Worker(
  config.workers.taggingQueue,
  async (job) => {
    try {
      const { itemId } = job.data;

      const item = await Item.findById(itemId);

      if (!item) {
        throw new Error(`Item ${itemId} not found`);
      }

      const { tags, topics } = await generateTags(item.title, item.content || '');

      item.autoTags = tags;
      item.topics = topics;

      await item.save();

      console.log(`Completed tagging for item ${itemId}`);

      return { success: true, itemId };
    } catch (error) {
      console.error(`Error tagging item:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

taggingWorker.on('completed', (job) => {
  console.log(`Tagging job ${job.id} completed`);
});

taggingWorker.on('failed', (job, err) => {
  console.log(`Tagging job ${job.id} failed: ${err.message}`);
});

export default taggingWorker;
