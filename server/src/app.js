import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import config from './core/config/env.config.js';
import { errorHandler, notFound } from './core/middlewares/error.middleware.js';

import authRoutes from './modules/auth/auth.routes.js';
import itemsRoutes from './modules/items/items.routes.js';
import searchRoutes from './modules/search/search.routes.js';
import collectionsRoutes from './modules/collections/collections.routes.js';
import highlightsRoutes from './modules/highlights/highlights.routes.js';

const app = express();

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(cookieParser());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const apiVersion = `/${config.apiVersion}`;

app.use(`${apiVersion}/auth`, authRoutes);
app.use(`${apiVersion}/items`, itemsRoutes);
app.use(`${apiVersion}/search`, searchRoutes);
app.use(`${apiVersion}/collections`, collectionsRoutes);
app.use(`${apiVersion}/highlights`, highlightsRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

export default app;
