import mongoose from "mongoose";
const variant=new mongoose.Schema({weight:Number,weightUnit:String,price:Number,compareAtPrice:Number,stock:Number,sku:String},{_id:true});
const schema=new mongoose.Schema({
 name:{type:String,required:true,index:true,trim:true}, slug:{type:String,required:true,unique:true,index:true}, sku:{type:String,required:true,unique:true,index:true},
 shortDescription:String, description:String, category:{type:mongoose.Schema.Types.ObjectId,ref:"Category",index:true}, subCategory:String, brand:{type:String,default:"RR MASALA"}, images:[String], thumbnail:String,
 price:{type:Number,min:0,required:true}, compareAtPrice:{type:Number,min:0}, discountPercentage:{type:Number,min:0,max:100}, taxPercentage:{type:Number,min:0,max:100,default:0},
 currency:{type:String,default:"INR",enum:["INR"]}, weight:Number, weightUnit:String, stock:{type:Number,min:0,default:0}, lowStockThreshold:{type:Number,min:0,default:10}, maxOrderQuantity:{type:Number,min:1,default:10},
 isActive:{type:Boolean,default:true,index:true}, isFeatured:{type:Boolean,default:false,index:true}, isBestSeller:{type:Boolean,default:false,index:true}, isNewArrival:{type:Boolean,default:true,index:true},
 tags:[String], ingredients:[String], allergens:[String], nutrition:mongoose.Schema.Types.Mixed, howToUse:String, storageInstructions:String, shelfLife:String, manufacturingInfo:String, origin:{type:String,default:"India"}, packagingType:String,
 countryOfOrigin:{type:String,default:"India"}, hsnCode:String, fssaiLicenseNo:String, manufacturerName:String, manufacturerAddress:String, packerName:String, packerAddress:String, importerName:String, importerAddress:String,
 netQuantity:String, mrpDeclaration:String, consumerCareEmail:String, consumerCarePhone:String, legalMetrologyDeclaration:String, exportNotes:String, isExportable:{type:Boolean,default:true},
 variants:[variant], seo:{title:String,description:String,keywords:[String]}
},{timestamps:true});
schema.index({name:"text",description:"text",tags:"text",sku:"text"});
// RR MASALA intentionally has one public product price in INR. Regional price maps are not supported.
schema.pre("validate",function(next){ if(this.price != null && this.compareAtPrice != null && this.compareAtPrice < this.price) return next(new Error("MRP cannot be lower than selling price")); next(); });
export default mongoose.model("Product",schema);
