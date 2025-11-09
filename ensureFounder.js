import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

export async function ensureFounder(){
  if(!process.env.FOUNDER_EMAIL || !process.env.FOUNDER_PASSWORD) return;
  if(mongoose.connection.readyState !== 1) await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  const existing = await User.findOne({ email: process.env.FOUNDER_EMAIL });
  if(existing) return;
  const h = await bcrypt.hash(process.env.FOUNDER_PASSWORD, parseInt(process.env.BCRYPT_SALT_ROUNDS||12));
  const u = new User({ email: process.env.FOUNDER_EMAIL, passwordHash: h, name:'Founder', role:'founder' });
  await u.save();
  console.log('Founder created');
}
