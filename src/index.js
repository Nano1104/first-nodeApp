/* import App from './app.js'; */
const App = require('./app.js');

//ROUTES
/* const ProdsRouter = require('./routes/prodsRouter.js') */
const BaseRoute = require('./routes/baseRoutes.js');

const app = new App([new BaseRoute()]);

app.listen()