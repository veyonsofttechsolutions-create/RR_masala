import Product from "../models/Product.js";
export async function decrement(items, session=null){
 const changed=[];
 try{
  for(const i of items){
   const qty=Number(i.quantity);
   if(!Number.isInteger(qty)||qty<1) throw Object.assign(new Error("Invalid quantity"),{status:422});
   const p=await Product.findOneAndUpdate({_id:i.product,isActive:true,stock:{$gte:qty}},{ $inc:{stock:-qty} },{new:true,session});
   if(!p) throw Object.assign(new Error(`Insufficient stock for ${i.name}`),{status:409});
   changed.push({product:i.product,quantity:qty});
  }
  return changed;
 }catch(e){
  if(!session){ for(const i of changed) await Product.findByIdAndUpdate(i.product,{$inc:{stock:i.quantity}}); }
  throw e;
 }
}
export async function increment(items, session=null){ for(const i of items) await Product.findByIdAndUpdate(i.product,{$inc:{stock:Number(i.quantity)||0}},{session}); }
