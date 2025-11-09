export function founderAuth(req,res,next){
  const key = req.headers['x-founder-key'] || req.body.founderKey;
  if(!key || key !== process.env.FOUNDER_KEY) return res.status(403).json({ error:'founder required' });
  next();
}
