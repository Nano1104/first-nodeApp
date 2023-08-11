const { connect } = require('mongoose');

const { DB_HOST, DB_PORT, DB_NAME, DB_CNN, PERSISTANCE } = require('../config/config');

const configConnection = {
    url: DB_CNN ?? `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
}

/////////////////////////////////// CONNECTION 
const mongoDBConnection = async () => {
    try {
        await connect(configConnection.url, configConnection.options)
        console.log(`========================================`)
        console.log(`======== Connected to MongoDB ===========`)
        console.log(`========================================`)
    } catch(err) {
        console.log("Failed connection to MongoDB", err);
    }
}

module.exports = {
    mongoDBConnection
}

