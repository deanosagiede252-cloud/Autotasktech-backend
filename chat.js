import express from 'express';
const router = express.Router();
router.get('/room/:roomId', (req,res) => {
  res.json({ ok:true, roomId:req.params.roomId, messages:[] });
});
export default router;
