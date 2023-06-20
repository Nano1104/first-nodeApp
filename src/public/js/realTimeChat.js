const socket = io()

let user;
const chatbox = document.getElementById('chatbox');
const send = document.getElementById('send');

send.addEventListener('click', () => console.log('funciona'))

Swal.fire({
    title: "IDENTIFICATION",
    input: 'text',
    text: "Write your username",
    inputValidator: (val) => {
        return !val && "Please enter a valid username"
    },
    allowOutsideClick: true,
    allowEscapeKey: true,
}).then((result) => user = result.value);

socket.emit('connection', 'Hola a todos')
