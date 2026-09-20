import {Router} from 'express';
import {auth} from '../middleware/auth.js';
import * as c from '../controllers/wishlistController.js';
const r=Router(); r.use(auth); r.get('/',c.get); r.post('/:productId/toggle',c.toggle); export default r;
