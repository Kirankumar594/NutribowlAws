import Checkout from "../models/CheckoutModel.js";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

export const processCheckout = async (req, res) => {
  try {
    const {
      orderType,
      selectedMeals,
      deliverySchedule,
      deliveryTimeSlot,
      deliveryAddress,
      specialInstructions,
      items,
      payment,
      customer
    } = req.body;

    // Basic manual validation
    if (!orderType || !deliveryAddress || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Calculate order totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = orderType === 'Subscription Plan' ? subtotal * 0.1 : 0;
    const total = subtotal - discount;

    // Create new checkout document
    const newCheckout = new Checkout({
      orderType,
      selectedMeals,
      deliverySchedule,
      deliveryTimeSlot,
      deliveryAddress,
      specialInstructions,
      items,
      payment,
      subtotal,
      discount,
      total,
      customer,
      status: 'Pending'
    });

    // Save to database
    const savedCheckout = await newCheckout.save();
    
    // Update status to confirmed
    // savedCheckout.status = 'Pending';
    // await savedCheckout.save();

    // Successful response
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: savedCheckout._id,
        orderType: savedCheckout.orderType,
        total: savedCheckout.total,
        deliveryDays: savedCheckout.deliverySchedule.days,
        deliveryTimeSlot: savedCheckout.deliveryTimeSlot
      }
    });

  } catch (error) {
    console.error('Checkout processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing checkout',
      error: error.message
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Checkout.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};


// // GET order by ID
export const getOderById = async (req, res) => {
  try {
    const { id } = req.params; // Changed from customerId to id
    
    // Find all orders with matching customer.id
    const orders = await Checkout.find({ "customer.id": id })
      .populate("customer.id", "name email phone")
      .exec();

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
}
// GET orders by customer ID
// export const getOrdersByCustomerId = async (req, res) => {
//   try {
//     const { customerId } = req.params;
    
//     // Validate customerId is a valid ObjectId
//     // if (!mongoose.Types.ObjectId.isValid(customerId)) {
//     //   return res.status(400).json({ message: "Invalid customer ID format" });
//     // }

//     // Find all orders with matching customer.id
//     const orders = await Checkout.find({ "customer.id": customerId })
//       .populate("customer.id", "name email phone") // optional: populate customer details
//       .sort({ createdAt: -1 }) // Sort by most recent first
//       .exec();

//     if (!orders || orders.length === 0) {
//       return res.status(404).json({ message: "No orders found for this customer" });
//     }

//     res.json(orders);
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// }


export const updateOrderStatus = async (req, res) => {
  try {
    console.log('Received status update request for order:', req.params.orderId);
    console.log('New status:', req.body.status);
    
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Validate orderId format (if using MongoDB ObjectId)
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    // Find and update the order
    const updatedOrder = await Checkout.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('Order status updated successfully:', updatedOrder._id, 'to', status);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        orderId: updatedOrder._id,
        status: updatedOrder.status,
        updatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};