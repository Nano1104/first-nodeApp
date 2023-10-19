


let total = 0
    const products = document.getElementsByClassName("prod-container")
    for(const prod of products) {           //por cada producto
      const prodId = prod.getAttribute("container-id")        //obtenemos su Id
      
      const quantityElement = document.getElementById(`quantity_${prodId}`)   //obtenemos su stock
      const quantity = quantityElement.getAttribute("quantity")
      
      const priceElement = document.getElementById(`price_${prodId}`)   //obtenemos su precio
      const price = priceElement.getAttribute("price")

      for(let i = quantity; i > 0; i--) {        //por el stock de cada producto 
        total += Number(price)
      }
    } 

    //obtiene el Id del cart
    const cartProdsElement = document.getElementById("cartProds-container")
    const cartId = cartProdsElement.getAttribute("data")
    
    //boton que finaliza la compra
    $('#btn-finishPurchase').click(() => {
      Swal.fire({
            title: 'Desea finalizar su compra?',
            text: `Su total a pagar es: ${total}`,
            showCancelButton: true,
            confirmButtonText: 'Si',
          }).then((result) => {
            if (result.isConfirmed) {           //Si se clickea sobre "SI" para finalizar la respuesta
                fetch(`/api/carts/${cartId}/purchase`, {        //se hace el POST a la ruta de finalizar compra
                    method: "POST"
                })
                
                Swal.fire({                             //Cuando se da click sobre "✔️" 
                    title: "Su compra a finalizado",
                    confirmButtonText: '✔️'
                }).then((result2) => {
                    if(result2.isConfirmed) {
                        window.location.href = `/api/carts/${cartId}`;  //se renderizara nuevamente la pagina
                    }
                }) 
            }
          }) 
    }) 