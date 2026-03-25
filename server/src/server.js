import app from './app.js';
import database from './core/database/connection.js';
import './workers/tagging.worker.js';
import './workers/embedding.worker.js';

const PORT = process.env.PORT || 3000;

// ✅ Start server FIRST
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Connect DB AFTER
database.connect()
  .then(() => console.log('Database connected ✅'))
  .catch(err => console.error('DB error ❌', err));