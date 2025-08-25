import Checkout from "../models/CheckoutModel.js";
import jwt from 'jsonwebtoken';

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
    savedCheckout.status = 'Confirmed';
    await savedCheckout.save();

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


// GET order by ID
export const getOderById = 
async (req, res) => {
  try {
    const { customerId } = req.params;

    // Find all orders with matching customer.id
    const orders = await Checkout.find({ "customer.id": customerId })
      .populate("customer.id", "name email phone") // optional: populate customer details
      .exec();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this customer" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
}
