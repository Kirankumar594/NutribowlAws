import validator from 'validator';

export const validateCheckout = (data) => {
  let errors = {};
  let isValid = true;

  if (!data.orderType || !['One-time Order', 'Subscription Plan'].includes(data.orderType)) {
    errors.orderType = 'Please select a valid order type';
    isValid = false;
  }

  if (!data.selectedMeals || data.selectedMeals.length === 0) {
    errors.selectedMeals = 'Please select at least one meal';
    isValid = false;
  }

  if (!data.deliverySchedule || !data.deliverySchedule.days || data.deliverySchedule.days.length === 0) {
    errors.deliverySchedule = 'Please select at least one delivery day';
    isValid = false;
  }

  if (!data.deliveryTimeSlot) {
    errors.deliveryTimeSlot = 'Please select a delivery time slot';
    isValid = false;
  }

  if (!data.deliveryAddress || data.deliveryAddress.trim().length < 10) {
    errors.deliveryAddress = 'Please enter a valid delivery address';
    isValid = false;
  }

  if (!data.items || data.items.length === 0) {
    errors.items = 'Please add at least one item to your order';
    isValid = false;
  } else {
    data.items.forEach((item, index) => {
      if (!item.name || !item.price || !item.quantity) {
        errors[`items[${index}]`] = 'Each item must have name, price and quantity';
        isValid = false;
      }
    });
  }

  if (!data.payment || !data.payment.paymentMethod) {
    errors.payment = 'Please select a payment method';
    isValid = false;
  } else if (data.payment.paymentMethod === 'Credit/Debit Card') {
    if (!data.payment.cardholderName) {
      errors.cardholderName = 'Cardholder name is required';
      isValid = false;
    }
    if (!data.payment.cardNumber || !validator.isCreditCard(data.payment.cardNumber)) {
      errors.cardNumber = 'Valid card number is required';
      isValid = false;
    }
    if (!data.payment.expiryDate || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(data.payment.expiryDate)) {
      errors.expiryDate = 'Valid expiry date (MM/YY) is required';
      isValid = false;
    }
    if (!data.payment.cvv || !/^[0-9]{3,4}$/.test(data.payment.cvv)) {
      errors.cvv = 'Valid CVV is required';
      isValid = false;
    }
  }

  if (!data.customer || !data.customer.name) {
    errors.customerName = 'Customer name is required';
    isValid = false;
  }
  if (!data.customer || !data.customer.email || !validator.isEmail(data.customer.email)) {
    errors.customerEmail = 'Valid email is required';
    isValid = false;
  }
  if (!data.customer || !data.customer.phone || !validator.isMobilePhone(data.customer.phone)) {
    errors.customerPhone = 'Valid phone number is required';
    isValid = false;
  }

  return { errors, isValid };
};