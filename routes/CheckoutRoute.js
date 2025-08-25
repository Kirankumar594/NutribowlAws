import express from 'express';
import { 
  processCheckout, 
  getAllOrders,getOderById
} from '../controllers/CheckoutController.js';

const router = express.Router();

router.post('/', processCheckout);
router.get('/', getAllOrders);
router.get('/:id', getOderById);

export default router;