import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15*60*1000, max: 200 }));

// connect mongo
const MONGO = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGO) {
  console.warn('MONGODB_URI not set — DB features disabled until configured.');
} else {
  mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>console.log('✅ MongoDB connected'))
    .catch(err=>console.error('❌ MongoDB connect error:', err.message));
}

// health
app.get('/api/health', (req,res) => res.json({ ok:true, env: process.env.NODE_ENV || 'development' }));
app.get('/', (req,res) => res.send('🚀 AutoTask Backend'));

// mount routes
import authRoutes from './routes/auth.js';
import walletRoutes from './routes/wallet.js';
import strategyRoutes from './routes/strategy.js';
import clRoutes from './routes/cl_index.js';
import chatRoutes from './routes/chat.js';

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/strategy', strategyRoutes);
app.use('/api/cl', clRoutes);
app.use('/api/chat', chatRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
