const express = require('express');
const cors = require('cors');
const displayRoutes = require('express-routemap'); 
const handlebars = require('express-handlebars');
const { NODE_ENV, PORT, API_VERSION } = require('./config/config.js');


/* import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import displayRoutes from 'express-routemap';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { NODE_ENV, PORT, API_VERSION } from './config/config.js'; */

/* const app = express();
const PORT = 8080;

//ROUTES
import prodsRouter from './routes/prodsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import viewRouter from './routes/viewsRouter.js';

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true})) //Para soportar las query params
app.use(express.static(`${__dirname}/public`))

//SETEO HANDLEBARS
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`)
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
   
}) */

class App {
    app;
    env;
    port;
    server;

    constructor(routes) {
        this.app = express();
        this.env = NODE_ENV || "development";
        this.port = PORT || 5000;

        this.initMiddlewares();
        this.initRoutes(routes);
        this.connectDB();
        this.initHandlebars();
    }

    getServer() {
        return this.app;
    }

    closeServer(done) {
        this.server = this.app.listen(this.port, () => done())
    }

    async connectDB() {
        ///
    }

    initMiddlewares() {
        this.app.use(cors())
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true})) //Para soportar las query params
        /* this.app.use(express.static(`${__dirname}/public`)) */
        this.app.use('/static', express.static(`${__dirname}/public`));
    }

    initRoutes(routes) {
        routes.forEach(route => {
            this.app.use(`/api${API_VERSION}`, route.routes)
        });
    }

    listen() {
        this.app.listen(this.port, () => {
            displayRoutes(this.app)
            console.log(`====================`)
            console.log(`======== ENV: ${this.env} =======`)
            console.log(`======== App listening on port ${this.port} =======`)
        })
    }

    initHandlebars() {
        this.app.engine('handlebars', handlebars.engine());
        this.app.set('views', `${__dirname}/views`)
        this.app.set('view engine', 'handlebars');
    }

}

module.exports = App


