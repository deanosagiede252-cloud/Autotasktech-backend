import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  email:{type:String,required:true,unique:true},
  passwordHash:{type:String,required:true},
  name:String,
  role:{type:String,default:'user'},
  deviceId:String,
  vipTier:{type:Number,default:0},
  walletId:{type:mongoose.Schema.Types.ObjectId, ref:'Wallet'},
  createdAt:{type:Date,default:Date.now}
});
export default mongoose.models.User || mongoose.model('User', UserSchema);
