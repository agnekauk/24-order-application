import express from 'express';
import orders from '../models/orders.js';
import products from '../models/products.js'

const Router = express.Router();

Router.post('/save-order', async (req, res) => {
    const neworder = new orders(req.body);
    neworder.save()
        .then(result => {
            try {
                res.json({ status: 'success', message: 'Užsakymas sėkmingai išsaugotas' })
            } catch (err) {
                res.json({ status: 'failed', message: 'Įvyko techninė klaida' })
            }
        })
})

Router.get('/show-orders', async (req, res) => {
    const list = await orders.find();
    let index = 0;

    for (let order of list) {
        let product = await products.findOne({ _id: order.products });
        list[index].products = product.product_name;
        index++;
    }
    res.json(list);
})

Router.delete('/delete-orders', async (req, res) => {
    let id = req.body.id;
    orders.findByIdAndDelete(id).exec();
    orders.find((err, data) => {
        if (err)
            return console.log(err)
        res.json(data);
    })
})

export default Router;