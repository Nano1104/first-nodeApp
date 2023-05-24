import express from 'express';
const app = express();
const PORT = 8080;

//ROUTES
import prodsRouter from './routes/prodsRouter.js';
import cartsRouter from './routes/cartsRouter.js';

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true})) //Para soportar las query params


app.use('/api/products', prodsRouter)
app.use('/api/carts', cartsRouter)

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
})




