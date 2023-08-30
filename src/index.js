const App = require('./app.js');

//ROUTES
const ProdsRouter = require('./routes/prodsRouter.js');
const CartsRouter = require('./routes/cartsRouter.js');
const ViewsRouter = require('./routes/viewsRouter.js');
const SessionRouter = require('./routes/sessionRouter.js');
const UsersRouter = require('./routes/usersRoutes.js');
const LoggerRouter = require("./routes/logger.routes.js");

const app = new App([new ProdsRouter(), new CartsRouter(), new ViewsRouter(), new SessionRouter(), new UsersRouter(), new LoggerRouter()]);

app.listen()

