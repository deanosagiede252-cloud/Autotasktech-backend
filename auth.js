import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

router.post('/signup', async (req,res) => {
  try{
    const { email, password, name, deviceId } = req.body;
    if(!email || !password) return res.status(400).json({ error:'missing' });
    const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS||12));
    const u = new User({ email, name, passwordHash:hash, deviceId });
    await u.save();
    res.json({ ok:true });
  }catch(e){ res.status(400).json({ error: e.message }); }
});

router.post('/login', async (req,res) => {
  try{
    const { email, password, deviceId } = req.body;
    const u = await User.findOne({ email });
    if(!u) return res.status(401).json({ error:'invalid' });
    const match = await bcrypt.compare(password, u.passwordHash);
    if(!match) return res.status(401).json({ error:'invalid' });
    if(u.deviceId && u.deviceId !== deviceId) return res.status(403).json({ error:'device mismatch' });
    u.deviceId = deviceId; await u.save();
    const token = jwt.sign({ id:u._id, role:u.role, email:u.email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });
  }catch(e){ res.status(500).json({ error:'server error' }); }
});

export default router;
