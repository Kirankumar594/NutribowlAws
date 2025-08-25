import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentMethod: {
    type: String,
    enum: ['Credit/Debit Card', 'PayPal', 'Google Pay', 'Apple Pay'],
    required: true
  },
  cardholderName: {
    type: String,
    required: function() { return this.paymentMethod === 'Credit/Debit Card'; }
  },
  cardNumber: {
    type: String,
    required: function() { return this.paymentMethod === 'Credit/Debit Card'; }
  },
  expiryDate: {
    type: String,
    required: function() { return this.paymentMethod === 'Credit/Debit Card'; }
  },
  cvv: {
    type: String,
    required: function() { return this.paymentMethod === 'Credit/Debit Card'; }
  }
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const checkoutSchema = new mongoose.Schema({
  orderType: {
    type: String,
    enum: ['One-time Order', 'Subscription Plan'],
    required: true
  },
  selectedMeals: [{
    type: String,
    enum: ['breakfast', 'lunch', 'dinner'],
    required: true
  }],
  deliverySchedule: {
    days: [{
      type: String,
      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      required: true
    }],
    pattern: {
      type: String,
      enum: ['Weekdays', 'All Days', 'M-W-F', 'Custom'],
      required: true
    }
  },
  deliveryTimeSlot: {
    type: String,
    required: true
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  specialInstructions: String,
  items: [orderItemSchema],
  payment: paymentSchema,
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  customer: {
    name: String,
    email: String,
    phone: String,
    id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Signup",
      required:true
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Checkout = mongoose.model('Checkout', checkoutSchema);

export default Checkout;