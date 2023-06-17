import { Router } from "express";
const router = Router();

import ProductManger from '../prodManager.js'; //traemos la clase constructora del index.js
const manager = new ProductManger();

router.get('/', async (req, res) => {
    const products = await manager.getProducts();
    res.render("home", {products});
})

router.get('/realtimeproducts', async (req, res) => {
    res.render("realTimeProducts");
})

export default router