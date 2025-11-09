import mongoose from 'mongoose';
const StrategySchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',default:null},
  name:String,
  description:String,
  privateLogicEncrypted:String,
  publicSummary:String,
  createdBy:{type:String,enum:['user','strategy','founder'],default:'user'},
  status:{type:String,default:'draft'},
  metrics:{ profit:{type:Number,default:0}, winRate:{type:Number,default:0} },
  createdAt:{type:Date,default:Date.now}
});
export default mongoose.models.Strategy || mongoose.model('Strategy', StrategySchema);
