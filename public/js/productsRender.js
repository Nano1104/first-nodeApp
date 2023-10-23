//FETCH PARA HACER UN REQUEST Y RECIBIR LOS PRODUCTOS QUE HAYA PARA PODER RENDERIZARLOS
fetch(`/api/products`, {
    method: "GET"
})
.then((res) => res.json())
.then((data) => {
    for(const prod of data.payload) {
        if(prod.stock > 0) {
            $("#prods-container").append(`
                                <div id=prod-container-${prod._id} class="prod-container m-3 text-center border d-inline-block p-5">
                                    <h2>${prod.title}</h2>
                                    <p>${prod.description}</p>
                                    <p>Precio: ${prod.price}</p>
                                    <p>Categoría: ${prod.category}</p>
                                    <p id=stock_${prod._id} data=${prod.stock}><i>Stock disponible: ${prod.stock}</i></p>
                                    <button class="btn btn-primary btn-add" value=${prod._id}>AGREGAR A CARRITO</button>
                                </div>
                                `)
        }
        
    }


    $(".prod-container").click((e) => {
        const productId = e.target.value
        fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: "POST"
        })
        .then((res) => res.json())
        .then((data) => {
            const productFound = data.cart.products.find(prod => prod.product._id == productId)
            $(`#stock_${productId}`).text(`${productFound.product.stock > 0
                                            ? `Stock disponible: ${productFound.product.stock}`
                                            : "Stock no disponible"}`)
            if(productFound.product.stock > 0) {
                Swal.fire('Producto Agregado!')
            } else {
                Swal.fire('Este producto se quedo fuera de stock')
            }
        })
        .catch((err) => console.log("Error al hacer la solicitud POST:", err)) 
    })   
})
.catch((err) => console.log("Error al hacer la solicitud POST:", err)) 


/* MOSTRAR CARRITO */
$("#cart")
    .click(() => {
        window.location.href = `/api/carts/${cartId}`;
    })
    .css({fontSize: "25px"})
$("#user-icon").css({fontSize: "25px"})























