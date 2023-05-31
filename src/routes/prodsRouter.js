import { Router } from "express";
const router = Router();


//TRAEMOS EL PRODUCT MANAGER PARA HACER USO DE SUS METODOS
import ProductManger from '../index.js'; //traemos la clase constructora del index.js
const manager = new ProductManger();

//////////////////////////////// GET PRODUCTS
router.get('/', async (req, res) => {
    const { limit } = req.query
    if(limit === '') {     
        res.json(await manager.getProducts())   //En caso de que no se espicique el limit en la URL, devuelve el array completo
    } else {               
        const prods = await manager.getProducts()   //Devuelve la cantidad especificada en la URL
        res.json(prods.slice(0, limit))
    }
})

//////////////////////////////// GET BY ID
router.get('/:pid', async (req, res) => {
    const product = await manager.getProductById(Number(req.params.pid))
    res.json(product);
})

//////////////////////////////// ADD PRODUCT
router.post('/', async (req, res) => {
    let io = req.app.get('socketio');       //IMPORTAMOS LA VARIABLE GLOBAL EN EL POST DESDE LA APP
    const prod = req.body
    const { title, description, code, price, status, stock, category, thumbnails } = prod

    if(await manager.addProduct(title, description, code, price, status, stock, category, thumbnails)) {    //si se completaron los campos se agregara de manera correcta 
        res.send({status: 200, "message": "Product added successfully"})     
        io.emit('postReq', await manager.getProducts())        
    } else {
        res.send({status: 400, "message": "Error adding product, some fields may be empty"})                //de lo contrario tira error 
    }
})

//////////////////////////////// UPDATE PRODUCT
router.put('/:pid', async (req, res) => {
    const update = req.body
    const id = Number(req.params.pid)

    await manager.updateProduct(id, update)
    res.send({status: 200, "message": "Product updated successfully"})
})

//////////////////////////////// DELETE PRODUCT
router.delete('/:pid', async (req, res) => {
    let io = req.app.get('socketio');       //IMPORTAMOS LA VARIABLE GLOBAL EN EL POST DESDE LA APP
    
    const id = Number(req.params.pid)
    await manager.deleteProduct(id)
    res.send({status: 200, message: "Product deleted successfully"})
    io.emit('deleted-prod', await manager.getProducts())
})

export default router;