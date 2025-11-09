import mongoose from 'mongoose';
const WalletSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  btcAddress:String,
  balanceSats:{type:Number,default:0},
  pendingSats:{type:Number,default:0},
  txs:[{txHash:String,amount:Number,status:String,ts:Date}],
  createdAt:{type:Date,default:Date.now}
});
export default mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema);
