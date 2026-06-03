const Message = require("../models/messageModel");

class MessageService {
  constructor() {}

  async getAll() {
    const messages = await Message.findAll();
    return messages;
  }

  async create(msg) {
    const message = await Message.create(msg);
    return message;
  }
}

module.exports = MessageService;