
const mongoose = require(`mongoose`);

const refreshSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    // jti:String,
    // ParentToken:String,
    // familyId:String,
    // revoked:{type:boolean, default:false},
    refreshToken:{type:String, required:true},
    // ip:{type:String},
    // device:{type:String},
    // location:{type:String},
    expiresAt:{type:Date, required:true}
},{timestamps:true}
);