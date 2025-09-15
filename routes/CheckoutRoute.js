import express from 'express';
import { 
  processCheckout, 
  getAllOrders,getOderById,
  updateOrderStatus
} from '../controllers/CheckoutController.js';

const router = express.Router();

router.post('/', processCheckout);
router.get('/', getAllOrders);
router.get('/:id', getOderById);
// In your backend routes
router.put('/:orderId/status', updateOrderStatus);
export default router;



