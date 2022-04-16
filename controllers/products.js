import express from 'express';
import products from '../models/products.js';

const Router = express.Router();

Router.get('/show-products', (req, res) => {
    products.find((err, data) => {
        if (err)
            return console.log(err)
        // kitas būdas:
        // const data = await products.find()
        res.json(data);
    })
})

export default Router;