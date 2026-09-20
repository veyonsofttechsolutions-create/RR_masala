import {Router} from 'express';
import * as c from '../controllers/authController.js';
import {auth,optionalAuth} from '../middleware/auth.js';
const r=Router();
r.post('/register',c.register); r.post('/login',c.login); r.post('/logout',c.logout);
r.get('/me',optionalAuth,(req,res)=>{if(!req.user)return res.json({success:true,data:{user:null}});return c.me(req,res);});
export default r;
