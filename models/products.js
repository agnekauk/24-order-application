import { mongoose } from 'mongoose';

const productsSchema = new mongoose.Schema({
    product_name: String,
    description: String,
    price: Number,
    discount_price: Number
});

export default mongoose.model('products', productsSchema);