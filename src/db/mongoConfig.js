const { connect, disconnect } = require('mongoose');

const { DB_HOST, DB_PORT, DB_NAME, DB_CNN } = require('../config/config');

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
        console.log(`======== Connected to MongoDB ===========`)
        console.log(`========================================`)
    } catch(err) {
        console.log("Failed connection to MongoDB", err);
    }
}

const disconnectDB = async () => {
    try {
        await disconnect()
        console.log(`========================================`)
        console.log(`======== Disconnected from MongoDB ===========`)
    } catch (err) {
        console.log("Failed disconnecting from MongoDB", err);
    }
}

module.exports = {
    mongoDBConnection,
    disconnectDB
}

