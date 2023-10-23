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
//DOCUMENTATION
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOpts = require("./config/swagger.options.js");
///ENV VARIBALES
const { NODE_ENV, PORT, PERSISTENCE } = require('./config/config.js');
//ROUTES
const ProdsRouter = require('./routes/prodsRouter.js');
const CartsRouter = require('./routes/cartsRouter.js');
const ViewsRouter = require('./routes/viewsRouter.js');
const SessionRouter = require('./routes/sessionRouter.js');
const UsersRouter = require('./routes/usersRoutes.js');
const LoggerRouter = require("./routes/logger.routes.js");

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
        this.env = NODE_ENV;
        this.port = PORT;
        
        this.initMiddlewares();
        this.initRoutes(routes);
        this.initDocumentation()
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
        this.app.use(setLogger)
    }

    initRoutes(routes) {
        routes.forEach(route => {
            this.app.use(`/api`, route.router)
        });
    }

    initDocumentation() {
        const specs = swaggerJSDoc(swaggerOpts)
        this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs))
    }

    listen() {
        const io = new Server(
            this.app.listen(this.port, () => {
                displayRoutes(this.app)
                console.log(`========================================`)
                console.log(`======== ENV: ${this.env} =======`)
                console.log(`======== App listening on port ${this.port} =======`)
                console.log(`======== PERSISTENCE: ${PERSISTENCE} =======`);
            })
        )
        this.app.set('socketio', io);
        io.on('connection', socket => {

            socket.on('new-user', async user => {          //cuando entra un nuevo user, y renderiza los mensajes de la db en todos
                const messages = await this.messManager.getMessages()
                socket.emit('server-messages', messages)
                socket.broadcast.emit('server-autentication', user)     //envia un mensaje al resto menos al actual
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


//INCIALIZAMOS LA APP Y SUS ROUTES
const app = new App([new ProdsRouter(), new CartsRouter(), new ViewsRouter(), new SessionRouter(), new UsersRouter()]);
app.listen()


