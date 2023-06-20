const socket = io();

let prodsContainer = document.getElementById('products')

socket.emit('connection', 'new manager connected')
socket.on('server-response', message => console.log(message))

socket.on('postReq', prods => {         //PARA AGREGAR PRODUCTO EN TIEMPO REAL
    prodsContainer.innerHTML = ' '
    for(const prod of prods) {
        prodsContainer.innerHTML += `<h3>${prod.title}</h3>`
    } 
})



socket.on('deleted-prod', prods => {    //PARA ELIMINAR PRODUCTO EN TIEMPO REAL
    prodsContainer.innerHTML = ' '
    for(const prod of prods) {
        prodsContainer.innerHTML += `<h3>${prod.title}</h3>`
    } 
})

