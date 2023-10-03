const express = require('express');
const cors = require('cors');
const displayRoutes = require('express-routemap'); 
const handlebars = require('express-handlebars');
///SOCKET
const { Server } = require("socket.io");
///PASSPORT
const passport = require('passport');
const { initializePassport } = require('./config/passport.config');
///MIDDLEWARES
const cookieParser = require('cookie-parser');
const { setLogger } = require("./utils/logger.js");
///ENV VARIBALES
const { NODE_ENV, PORT, DB_HOST, DB_NAME, DB_PORT, DB_CNN } = require('./config/config.js');

//TRAEMOS EL MANAGER DE LOS MENSAJES PARA PODER TRABAJAR CON ELLOS EN EL CHAT DE SOCKET
const MessagesManager = require('./managers/messages.manager.js');

class App {
    app;
    env;
    port;
    server;
    messManager = new MessagesManager();

    constructor(routes) {
        this.app = express();
        this.env = NODE_ENV || "development";
        this.port = PORT || 5000;
        
        this.initMiddlewares();
        this.initRoutes(routes);
        this.initHandlebars();
    }

    getServer() {
        return this.app;
    }

    initMiddlewares() {
        this.app.use(cors())
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true})) //Para soportar las query params
        this.app.use(express.static("public"))
        this.app.use(cookieParser());
        initializePassport()
        this.app.use(passport.initialize());
        this.app.use(setLogger);
    }

    initRoutes(routes) {
        routes.forEach(route => {
            this.app.use(`/api`, route.router)
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

        io.on('connection', socket => {
            console.log('New user connected')

            socket.on('new-user', async user => {          //cuando entra un nuevo user, envia un mensaje al resto menos al actual y renderiza los mensajes de ld db en todos
                const messages = await this.messManager.getMessages()
                socket.emit('server-messages', messages)
                socket.broadcast.emit('server-autentication', user)
            })

            socket.on('message', async message => {         //envia el mensaje a la base de datos
                console.log(`User ${message.user} has sent a message`)
                this.messManager.creatMessage(message)
            });
        })
    }

    initHandlebars() {
        this.app.engine('handlebars', handlebars.engine());
        this.app.set('views', __dirname + '/../views');
        this.app.set('view engine', 'handlebars');
    }

}

module.exports = App


