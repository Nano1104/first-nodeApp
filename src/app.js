const express = require('express');
const { Server } = require("socket.io");
const cors = require('cors');
const displayRoutes = require('express-routemap'); 
const handlebars = require('express-handlebars');
const { NODE_ENV, PORT, API_VERSION } = require('./config/config.js');
const { mongoDBConnection } = require('./db/mongoConfig');  


/* const io = new Server(server)

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
        await mongoDBConnection()
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
            this.app.use(`/api/${API_VERSION}`, route.router)
        });
    }

    listen() {
        const io = new Server(
            this.app.listen(this.port, () => {
                displayRoutes(this.app)
                console.log(`========================================`)
                console.log(`======== ENV: ${this.env} =======`)
                console.log(`======== App listening on port ${this.port} =======`)
            })
        )

        io.on('connection', data => {
            console.log('nuevo cliente conectado')
            console.log(data)
            io.emit('server-response', 'SERVER OK')
        })
    }

    initHandlebars() {
        this.app.engine('handlebars', handlebars.engine());
        this.app.set('views', `${__dirname}/views`)
        this.app.set('view engine', 'handlebars');
    }

}

module.exports = App


