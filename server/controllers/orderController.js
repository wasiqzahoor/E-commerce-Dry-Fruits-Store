import Order from '../models/orderModel.js';

// @desc   Create a new order
// @route  POST /api/orders
// @access Public
const createOrder = async (req, res) => {
  try {
    const { customerDetails, orderItems, paymentMethod, totalPrice: frontEndTotalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // --- FIX #1: Server-side calculation ko dobara check karein ---
    // Yeh security ke liye ahem hai taake koi price manipulate na kar sake
    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = 250; // YEH VALUE FRONTEND KE SAATH MATCH HONI CHAHIYE
    const calculatedTotalPrice = itemsPrice + shippingPrice;

    const order = new Order({
      user: req.user._id, // User ID token se aa rahi hai

      // --- FIX #2: Customer details ab form se aa rahi hain ---
      // Hum form ki saari details (...customerDetails) le rahe hain,
      // lekin email hamesha logged-in user ka hi rakh rahe hain.
      customerDetails: {
        ...customerDetails, // Is mein form ka 'name', 'address', 'phone' aa jayega
        email: req.user.email, // Email ko hum req.user se overwrite kar rahe hain
      },
      orderItems,
      paymentMethod,
      totalPrice: calculatedTotalPrice, // Hamesha server par calculate ki hui price save karein
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error)
  {
    console.error(`Error in createOrder: ${error.message}`);
    res.status(500).json({ message: 'Server Error while creating order.' });
  }
};
const getMyOrders = async (req, res) => {
  // req.user._id humein 'protect' middleware se mil raha hai
  const orders = await Order.find({ 'customerDetails.email': req.user.email }).sort({ createdAt: -1 });
  res.status(200).json(orders);
};
const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // 1. Check karein ke order user ka hi hai
    if (order.customerDetails.email !== req.user.email) {
      return res.status(401).json({ message: 'Not authorized to cancel this order' });
    }
    
    // 2. Check karein ke order ka status 'Pending' hai
    if (order.orderStatus !== 'Pending') {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    // 3. Check karein ke order 2 ghantay se purana na ho
    const twoHours = 2 * 60 * 60 * 1000; // 2 ghantay in milliseconds
    const orderTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();

    if (currentTime - orderTime > twoHours) {
      return res.status(400).json({ message: 'Cancellation window has passed' });
    }
    
    order.orderStatus = 'Cancelled';
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);

  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};
const getAllOrders = async (req, res) => {
  try {
    // URL se status query nikalne ki koshish karein (e.g., /api/orders?status=active)
    const { status } = req.query;
    let filter = {}; // Shuru mein filter khali rakhein

    // Query ke hisab se filter object banayein
    if (status === 'active') {
      // Agar 'active' manga hai, to sirf Pending aur Shipped orders dhoondein
      filter.orderStatus = { $in: ['Pending', 'Shipped'] };
    } else if (status === 'history') {
      // Agar 'history' mangi hai, to sirf Delivered, Cancelled, aur Out of Stock dhoondein
      filter.orderStatus = { $in: ['Delivered', 'Cancelled', 'Out of Stock'] };
    }
    // Agar koi status nahi diya, to filter khali rahega aur saare orders aayenge

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const { status } = req.body;
      
      // Allowed statuses jo admin set kar sakta hai
      const allowedStatuses = ['Shipped', 'Delivered', 'Cancelled', 'Out of Stock'];
      
      if (allowedStatuses.includes(status)) {
        order.orderStatus = status;
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
      } else {
        return res.status(400).json({ message: "Invalid status update" });
      }

    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
export { createOrder,getMyOrders,cancelOrder,getAllOrders,updateOrderStatus  };