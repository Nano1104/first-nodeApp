const messagesModel = require('../models/messages.model.js'); 

class MessagesManager {
    getMessages = async () => {
        return await messagesModel.find({})
    }

    creatMessage = async (message) => {
        await messagesModel.create({ ...message })
    }
}

module.exports = MessagesManager;