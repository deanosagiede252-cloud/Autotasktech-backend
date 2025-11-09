import express from 'express';
import Wallet from '../models/Wallet.js';
const router = express.Router();

router.get('/balance', async (req,res) => {
  const userId = req.query.userId;
  const w = await Wallet.findOne({ userId });
  if(!w) return res.json({ balanceSats:0, pendingSats:0 });
  res.json({ balanceSats:w.balanceSats, pendingSats:w.pendingSats });
});

router.post('/withdraw', async (req,res) => {
  const { userId, amountSats } = req.body;
  const commissionPercent = 0.25;
  const commission = Math.floor(amountSats * commissionPercent);
  const userAmount = amountSats - commission;
  const w = await Wallet.findOne({ userId });
  if(!w) return res.status(400).json({ error:'wallet not found' });
  if(w.balanceSats < amountSats) return res.status(400).json({ error:'insufficient funds' });
  w.balanceSats -= amountSats;
  w.pendingSats += userAmount;
  await w.save();
  res.json({ ok:true, commission, userAmount });
});

export default router;
