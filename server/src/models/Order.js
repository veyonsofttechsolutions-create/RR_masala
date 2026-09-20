import mongoose from "mongoose";
const item=new mongoose.Schema({product:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},name:String,sku:String,image:String,quantity:{type:Number,min:1},price:{type:Number,min:0},weight:String},{_id:false});
const schema=new mongoose.Schema({
 orderNumber:{type:String,unique:true,index:true}, customer:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true}, items:[item], shippingAddress:mongoose.Schema.Types.Mixed, billingAddress:mongoose.Schema.Types.Mixed,
 orderType:{type:String,enum:["DOMESTIC","INTERNATIONAL"],default:"DOMESTIC",index:true}, shippingMethod:{type:String,enum:["DOMESTIC","AIR","SEA"],default:"DOMESTIC"}, currency:{type:String,default:"INR",enum:["INR"]},
 subtotal:Number,discount:Number,tax:Number,shippingFee:Number,grandTotal:Number,
 paymentMethod:{type:String,enum:["UPI","PHONEPE","COD","RAZORPAY","STRIPE"],default:"UPI"}, paymentProvider:{type:String,default:"PHONEPE"}, paymentStatus:{type:String,enum:["PENDING","PAID","FAILED","REFUNDED","CANCELLED"],default:"PENDING",index:true}, paymentTransactionId:String,paymentUrl:String,paidAt:Date,
 orderStatus:{type:String,enum:["PENDING","CONFIRMED","PROCESSING","PACKED","SHIPPED","OUT_FOR_DELIVERY","DELIVERED","CANCELLED"],default:"PENDING",index:true}, notes:String, internalNotes:String, trackingNumber:String, carrier:String, estimatedDelivery:Date,
 whatsappStatus:{type:String,enum:["NOT_CONFIGURED","PENDING","SENT","FAILED"],default:"NOT_CONFIGURED"}, cancelReason:String,
 returnStatus:{type:String,enum:["NONE","REQUESTED","APPROVED","REJECTED","PICKUP_SCHEDULED","RECEIVED","REFUNDED","CLOSED"],default:"NONE"}, stockReleasedAt:Date, paymentExpiresAt:Date
},{timestamps:true});
schema.index({createdAt:-1});
export default mongoose.model("Order",schema);
