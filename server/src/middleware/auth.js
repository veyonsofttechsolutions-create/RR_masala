import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';

function getToken(req){return req.cookies?.token || (req.headers.authorization||'').replace('Bearer ','');}
export async function auth(req,res,next){try{const token=getToken(req);if(!token)return res.status(401).json({success:false,message:'Authentication required'});const p=jwt.verify(token,env.jwtSecret);const user=await User.findById(p.id);if(!user||!user.isActive)return res.status(401).json({success:false,message:'Invalid session'});req.user=user;next()}catch(e){return res.status(401).json({success:false,message:'Invalid or expired session'})}}
export async function optionalAuth(req,res,next){try{const token=getToken(req);if(token){const p=jwt.verify(token,env.jwtSecret);const user=await User.findById(p.id);if(user?.isActive)req.user=user;}next()}catch{next()}}
export function roles(...allowed){return(req,res,next)=>allowed.includes(req.user.role)?next():res.status(403).json({success:false,message:'Forbidden'})}
