import express from 'express';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';

const app = express();
const PORT = 8080;

//ROUTES
import prodsRouter from './routes/prodsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import viewRouter from './routes/viewsRouter.js';

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true})) //Para soportar las query params
app.use(express.static(`${__dirname}/public`))

//SETEO
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

const products = []     //creamos el array para los productos que se mostraran en tiempo real

app.use('/api/products', prodsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewRouter)

const server = app.listen(PORT, () => console.log(`App listening on ${PORT}`))
const io = new Server(server)

app.set('socketio', io);        //creamos el seteo de una variable global para io con el fin de usarla en el 'prodsRouter'

io.on('connection', socket => {
    
    socket.on('connection', socket => {
        console.log('new connection established')
        io.emit('server-response', 'server-listening')
    })
   
})


//MINUTO 1:44:00 DONDE ME QUEDE


