const socket = io();

//traemos el manager de los mensajes para poder mostrarlos
/* const MessagesManager = require('../../src/dao/managers/messages.manager');
import MessagesManager from '../../src/dao/managers/messages.manager'; */
/* const manager = new MessagesManager(); */
let content;
let user;
const chatbox = document.getElementById('chatbox');
const send = document.getElementById('send');
let messageContainer = document.getElementById('messages-container')

//cartel de autentificacion
Swal.fire({
    title: "IDENTIFICATION",
    input: 'text',
    text: "Write your username",
    inputValidator: (val) => {
        return !val && "Please enter a valid username"
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
}).then((result) => {
    user = result.value
    socket.emit('new-user', user)
});

//evento del button send
send.addEventListener('click', async () => {
    if(chatbox.value.trim().length > 0) {
        socket.emit('message', { user,  message: chatbox.value.trim() })
        chatbox.value = ' ';
        Swal.fire({
            toast: true,
            position: 'top-end',
            timer: 2000,
            title: 'Mensaje enviado',
            icon: 'success'
        })
    }
})

//para recibir los messages de la db en tiempo real y procesarlos
socket.on('server-messages', data => {
    console.log('listening messages')
    console.log(data)
    for(const mess of data) {
        messageContainer.innerHTML += `<strong>${mess.user}</strong>: ${mess.message}</br>`
    }
})

//cartel de cuando se une alguien al chat
socket.on('server-autentication', data => {
    Swal.fire({
        toast: true,
        position: 'top-end',
        timer: 3000,
        title: `${data} se ha unido`,
        icon: 'success'
    })
})

