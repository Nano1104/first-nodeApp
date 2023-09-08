const fs = require('fs');

class ProductsMemDao {
    constructor() {
        this.prodsJSON = "products.json";
    }

    getProducts = async () => {
        if(fs.existsSync(this.prodsJSON)) {
            const data = await fs.promises.readFile(this.prodsJSON, 'utf8');
            const products = JSON.parse(data)
            return products
        } else {
            return []
        }
    }

    getProductById = async (id) => {
        const products = await this.getProducts()
        const prodFound = products.find(prod => prod.id == Number(id))
        return prodFound
    }

    createProduct = async (prodToAdd) => {
        const { title, description, code, price, stock, category, status, thumbnails } = prodToAdd
        const products = await this.getProducts()       //traemos los products del json luego de hacer el readFile, en caso de que haya
        
        if(title && description && code && price && stock && category) {
            const newProduct = {
                title,
                description,
                price,
                stock,
                category,
                status,
                thumbnails
            }
            products.length === 0 ? newProduct.id = 1 : newProduct.id = products[products.length - 1].id + 1; //se crea el id de manera autoincramental
            
            let productsValues = []
            for(const prod of products) {
                const values = Object.values(prod)
                productsValues = [...productsValues, ...values] //obtiene todos los valores de los anteriores productos 
            }
            
            if(productsValues.indexOf(code) === -1) {           //verifica si el si ya existia un producto con el code actual para que no se repite
                newProduct.code = code
                products.push(newProduct)
                await fs.promises.writeFile(this.prodsJSON, JSON.stringify(products, null, '\t'))
            }
        } else {
            console.log("Error creating product")
            res.status(400)
        }
    }

    updateProduct = async (id, update) => {
        const products = await this.getProducts()
        const indexToUpdate = products.findIndex(prod => prod.id == id) 
        products.splice(indexToUpdate, 1, {
            ...update,
            id: products[indexToUpdate].id,
            code: products[indexToUpdate].code
        })

        await fs.promises.writeFile(this.prodsJSON, JSON.stringify(products, null, '\t'))
    }

    deleteProduct = async (id) => {
        const products = await this.getProducts()
        const indexToDelete = products.findIndex(prod => prod.id == id) 
        products.splice(indexToDelete, 1)

        await fs.promises.writeFile(this.prodsJSON, JSON.stringify(products, null, '\t'))
    }
}

module.exports = ProductsMemDao;