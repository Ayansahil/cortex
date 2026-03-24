import app from './app.js';
import config from './core/config/env.config.js';
import database from './core/database/connection.js';
import './workers/tagging.worker.js';
import './workers/embedding.worker.js';

// ✅ Always use Render port in production, fallback for local
const PORT = process.env.PORT || 3000;

// ✅ Start server FIRST 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.env}`);
});

// ✅ Connect DB AFTER server starts (non-blocking)
database.connect()
  .then(() => console.log('Database connected successfully ✅'))
  .catch((err) => console.error('Database connection failed ❌', err));