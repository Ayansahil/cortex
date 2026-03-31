import { Worker } from 'bullmq';
console.log('Tagging worker started 🚀');
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
      const { itemId, highlightId } = job.data;

      if (itemId) {
        const item = await Item.findById(itemId);
        if (!item) throw new Error(`Item ${itemId} not found`);
        const analysis = await generateTags(item.title, item.content || '');
        item.autoTags = analysis.autoTags;
        item.tags = analysis.tags;
        item.summary = analysis.summary;
        item.analysisDescription = analysis.analysisDescription;
        item.keyPoints = analysis.keyPoints;
        item.insight = analysis.insight;
        item.topics = analysis.topics;
        await item.save();
        console.log(`Completed tagging for item ${itemId}`);
      } else if (highlightId) {
        const { Highlight } = await import('../core/database/models/index.js');
        const highlight = await Highlight.findById(highlightId);
        if (!highlight) throw new Error(`Highlight ${highlightId} not found`);
        const { autoTags, tags } = await generateTags('', highlight.text);
        highlight.autoTags = autoTags;
        highlight.tags = tags;
        await highlight.save();
        console.log(`Completed tagging for highlight ${highlightId}`);
      }

      return { success: true };
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
