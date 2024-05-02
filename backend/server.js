const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://abhinavavi0123:abhinavserver@cluster0.pzmieaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define schema for shipping data
const customerSchema = new mongoose.Schema({
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
  });
  
  // Define shipping schema
  const shippingSchema = new mongoose.Schema({
    name: { type: String, default: 'International' },
    street: { type: String },
    town_city: { type: String },
    county_state: { type: String },
    postal_zip_code: { type: String },
    country: { type: String },
  });

// Define schema for payment data
const paymentSchema = new mongoose.Schema({
  cardholderName: String,
  cardNumber: String,
  expiryDate: String,
  cvv: String,
});
const orderSchema = new mongoose.Schema({
    version: { type: String },
    sandbox: { type: Boolean },
    id: { type: String },
    checkout_token_id: { type: String },
    cart_id: { type: String },
    customer_reference: { type: String },
    created: { type: Number },
    status: { type: String },
    status_payment: { type: String },
    status_fulfillment: { type: String },
    currency: {
      code: { type: String },
      symbol: { type: String }
    },
    order_value: {
      raw: { type: Number },
      formatted: { type: String },
      formatted_with_symbol: { type: String },
      formatted_with_code: { type: String }
    },
    conditionals: {
      collected_fullname: { type: Boolean },
      collected_shipping_address: { type: Boolean },
      collected_billing_address: { type: Boolean },
      collected_extra_fields: { type: Boolean },
      collected_tax: { type: Boolean },
      collected_eu_vat_moss_evidence: { type: Boolean },
      has_physical_fulfillment: { type: Boolean },
      has_digital_fulfillment: { type: Boolean },
      has_extend_fulfillment: { type: Boolean },
      has_webhook_fulfillment: { type: Boolean },
      has_extend_apps: { type: Boolean },
      has_pay_what_you_want: { type: Boolean },
      has_discounts: { type: Boolean },
      has_subscription_items: { type: Boolean },
      is_free: { type: Boolean },
      is_fulfilled: { type: Boolean }
    },
    meta: { type: Object },
    redirect: { type: Boolean },
    collected: {
      fullname: { type: Boolean },
      shipping_address: { type: Boolean },
      billing_address: { type: Boolean },
      extra_fields: { type: Boolean },
      tax: { type: Boolean },
      eu_vat_moss_evidence: { type: Boolean }
    },
    has: {
      physical_fulfillment: { type: Boolean },
      digital_fulfillment: { type: Boolean },
      extend_fulfillment: { type: Boolean },
      webhook_fulfillment: { type: Boolean },
      extend_apps: { type: Boolean },
      pay_what_you_want: { type: Boolean },
      discounts: { type: Boolean },
      subscription_items: { type: Boolean }
    },
    is: {
      free: { type: Boolean },
      fulfilled: { type: Boolean }
    },
    fraud: { type: Array },
    shipping: {
      id: { type: String },
      name: { type: String },
      street: { type: String },
      street_2: { type: String },
      town_city: { type: String },
      postal_zip_code: { type: String },
      county_state: { type: String },
      country: { type: String },
      delivery_instructions: { type: String },
      meta: { type: Object }
    },
    billing: { type: Array },
    transactions: { type: Array },
    fulfillment: {
      physical: { type: Object },
      digital: { type: Object }
    },
    customer: {
      id: { type: String },
      external_id: { type: String },
      firstname: { type: String },
      lastname: { type: String },
      email: { type: String },
      phone: { type: String },
      meta: { type: Array },
      created: { type: Number },
      updated: { type: Number }
    },
    extra_fields: { type: Array },
    client_details: {
      ip_address: { type: String },
      country_code: { type: String },
      country_name: { type: String },
      region_code: { type: String },
      region_name: { type: String },
      city: { type: String },
      postal_zip_code: { type: String },
      _copyright: { type: String }
    },
    tax: {
      amount: { type: Object },
      included_in_price: { type: Boolean },
      provider: { type: String },
      provider_type: { type: String },
      breakdown: { type: Array },
      zone: { type: Object }
    },
    adjustments: { type: Array },
    merchant: {
      id: { type: Number },
      status: { type: String },
      country: { type: String },
      currency: { type: Object },
      has: { type: Object },
      support_email: { type: String },
      logo_shape: { type: String },
      intercom: { type: Boolean },
      analytics: { type: Object },
      business_name: { type: String },
      business_description: { type: String },
      logo: { type: String },
      cover: { type: String },
      images: { type: Object }
    }
  });
  
  const Order = mongoose.model('Order', orderSchema);

// Models
const ShippingModel = mongoose.model('Shipping', shippingSchema);
const PaymentModel = mongoose.model('Payment', paymentSchema);
const CustomerModel = mongoose.model('customer', customerSchema);

// Routes
app.post('/api/checkout', async (req, res) => {
  try {
    const { order }  = req.body;
    console.log(req.body);
    const orderdata = await Order.create(order);
    res.status(201).json(orderdata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/test', async (req, res) => {
  try {
    console.log(req.body);
    res.status(201).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET route to fetch order details by customer reference
app.get('/api/orders/:customerReference', async (req, res) => {
  try {
    const { customerReference } = req.params;
    console.log(customerReference)
    const orders = await Order.find({ customer_reference: customerReference });

    if (!orders) {
      return res.status(404).json({ message: 'Orders not found' });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/orders/delete", async (req, res) => {
  try {
    const {customerReference} = req.body;
    console.log(req.body)
    const reservation = await Order.findOneAndDelete({ customer_reference:customerReference });
    if (!reservation) {
      return res.send({ message: "Reservation not found" });
    }
    res.send({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
