const fs = require('fs');

class ProductManager {
    constructor() {
        this.path = 'products.json';
    }

    //////////////////////////////// ADDPRODUCT
    addProduct = async (title, description, code, price, status = true, stock, category, thumbnails) => {
        const products = await this.getProducts() //traemos los products del json luego de hacer el readFile, en caso de que haya

        if(title, description, code, price, status, stock, category) {
            const newProduct = {
                title,
                description,
                price,
                status,
                stock,
                category,
                thumbnails
            }
            products.length === 0 ? newProduct.id = 1 : newProduct.id = products[products.length - 1].id + 1; //se crea el id de manera autoincramental
            
            let productsValues = []
            for(const prod of products) {
                const values = Object.values(prod)
                productsValues = [...productsValues, ...values] //obtiene todos los valores de los anteriores productos 
            }

            if(productsValues.indexOf(code) === -1) { //verifica si el si ya existia un producto con el code actual para que no se repite
                newProduct.code = code
                products.push(newProduct)
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
            }
            return true
        } else {
            return false
        }
    }
    //////////////////////////////// GETPRODUCTS
    getProducts = async () => {
        if(fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf8');
            const products = JSON.parse(data)
            return products
        } else {
            return []
        }
    }
    //////////////////////////////// GETBYID
    getProductById = async (id) => {
        const products = await this.getProducts() //traemos todos los products del json
        let productFound = products.find(prod => prod.id === id)
        return productFound !== undefined ? productFound : "Not found";
    }
    //////////////////////////////// UPDATE 
    updateProduct = async (id, field) => {
        const products = await this.getProducts()
        let productFound = products.find(prod => prod.id === id)
        products.splice(products.indexOf(productFound), 1, { ...productFound, ...field })
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
    }
    //////////////////////////////// DELETE 
    deleteProduct = async (id) => {
        const products = await this.getProducts()
        let productFound = products.find(prod => prod.id === id) //buscamos el prod a borrar
        products.splice(products.indexOf(productFound), 1)
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
    }
}

module.exports = ProductManager;



