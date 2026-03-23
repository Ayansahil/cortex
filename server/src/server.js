import app from './app.js';
import config from './core/config/env.config.js';
import database from './core/database/connection.js';

const startServer = async () => {
  try {
    await database.connect();
    console.log('Database connected successfully ✅');

    const PORT = config.port;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} ✅`);
      console.log(`Environment: ${config.env} ✅`);
    });
  } catch (error) {
    console.error('Failed to start server ❌', error);
    process.exit(1);
  }
};

startServer();
