import { mongoose } from 'mongoose';

const ordersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    address: String,
    city: String,
    post_code: String,
    email: String,
    phone: String,
    shipping_method: String,
    payment_method: String,
    products: String,
    total: Number
});

export default mongoose.model('orders', ordersSchema, 'orders');