import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import products from './controllers/products.js';
import orders from './controllers/orders.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: false
}))

app.use('/products/', products);
app.use('/orders', orders);

app.use('/assets', express.static('public/assets'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

const init = async () => {
    try {
        mongoose.connect('mongodb://localhost/orderManagement');
        app.listen(3011);
        console.log("Prisijungimas pavyko");
    } catch (err) {
        console.log(err);
    }
}

init();
