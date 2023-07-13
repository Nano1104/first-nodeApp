const express = require('express');
const { Server } = require("socket.io");
const cors = require('cors');
const displayRoutes = require('express-routemap'); 
const handlebars = require('express-handlebars');
const { NODE_ENV, PORT, DB_HOST, DB_NAME, DB_PORT } = require('./config/config.js');
const { mongoDBConnection } = require('./db/mongoConfig');  
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

//TRAEMOS EL MANAGER DE LOS MENSAJES PARA PODER TRABAJAR CON ELLOS EN EL CHAT
const MessagesManager = require('./dao/managers/messages.manager.js');

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
        /* this.app.use(express.static(path.join(`${__dirname}/public`))) */
        /* this.app.use('/static', express.static(`${__dirname}/public`)); */
        this.app.use(express.static("public"))
        this.app.use(cookieParser());
        this.app.use(session({
            store: MongoStore.create({
                mongoUrl: `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
                mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true, },
                ttl: 60
            }),
            secret: 'secretSession',
            resave: false,
            saveUninitialized: false
        }))
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
        /* this.app.set('views', `${__dirname}/views`) */
        this.app.set('views', __dirname + '/views');
        this.app.set('view engine', 'handlebars');
    }

}

module.exports = App


