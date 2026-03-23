import database from '../core/database/connection.js';
import taggingWorker from './tagging.worker.js';
import embeddingWorker from './embedding.worker.js';

const startWorkers = async () => {
  try {
    await database.connect();
    console.log('Workers started and listening for jobs');

    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down workers...');
      await taggingWorker.close();
      await embeddingWorker.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Error starting workers:', error);
    process.exit(1);
  }
};

startWorkers();
