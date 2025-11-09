import express from 'express';
import Strategy from '../models/Strategy.js';
const router = express.Router();

router.post('/create', async (req,res) => {
  const { userId, name, description, privateLogicEncrypted, publicSummary } = req.body;
  const s = new Strategy({ userId, name, description, privateLogicEncrypted, publicSummary });
  await s.save();
  res.json({ ok:true, id:s._id });
});

router.get('/:id', async (req,res) => {
  const s = await Strategy.findById(req.params.id);
  if(!s) return res.status(404).json({ error:'not found' });
  res.json(s);
});

export default router;
