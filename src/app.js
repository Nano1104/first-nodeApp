import express from 'express';
const app = express();
const PORT = 3000;

import ProductManger from './index.js'; //traemos la clase constructora del index.js
const manager = new ProductManger();

app.use(express.urlencoded({ extended: true})) //Para soportar las query params


//////////////////////////////// GET PRODUCTS
app.get('/products', async (req, res) => {
    const { limit } = req.query
    if(limit === '') {     
        res.json(await manager.getProducts())   //En caso de que no se espicique el limit en la URL, devuelve el array completo
    } else {               
        const prods = await manager.getProducts()   //Devuelve la cantidad especificada en la URL
        res.json(prods.slice(0, limit))
    }
})

//////////////////////////////// GET BY ID
app.get('/products/:pid', async (req, res) => {
    const product = await manager.getProductById(Number(req.params.pid))
    res.json(product);
})

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
})

