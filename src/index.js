const App = require('./app.js');

//ROUTES
const ProdsRouter = require('./routes/prodsRouter.js');
const CartsRouter = require('./routes/cartsRouter.js');
const ViewsRouter = require('./routes/viewsRouter.js');

const app = new App([new ProdsRouter(), new CartsRouter(), new ViewsRouter()]);

app.listen()


/* VXhcbzmFCzPLq0YS */

/* mongodb://localhost:27017 */