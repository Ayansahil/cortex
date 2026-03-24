import { Queue } from 'bullmq';
import Redis from 'ioredis';
import config from '../core/config/env.config.js';

const redisConnection = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password || undefined,
});

export const taggingQueue = new Queue(config.workers.taggingQueue, {
  connection: redisConnection,
});

export const embeddingQueue = new Queue(config.workers.embeddingQueue, {
  connection: redisConnection,
});

export const queueTaggingJob = async (itemId) => {
  try {
    await taggingQueue.add(
      'tag-item',
      { itemId },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      }
    );
  } catch (error) {
    console.error('Error queueing tagging job:', error);
  }
};

export const queueEmbeddingJob = async (itemId) => {
  try {
    await embeddingQueue.add(
      'embed-item',
      { itemId },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      }
    );
  } catch (error) {
    console.error('Error queueing embedding job:', error);
  }
};
export const queueHighlightTaggingJob = async (highlightId) => {
  try {
    await taggingQueue.add(
      'tag-highlight',
      { highlightId },
      {
        attempts: 2,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
      }
    );
  } catch (error) {
    console.error('Error queueing highlight tagging job:', error);
  }
};
