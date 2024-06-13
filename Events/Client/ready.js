const { ActivityType, Client } = require("discord.js");
const mongoose = require("mongoose");
const { loadCommands } = require('../../Handlers/commandHandler.js');
const { loadPrefixCommands } = require('../../Handlers/prefixCommands.js');

module.exports = {
  name: "ready",
  once: true,

  /**
   * @param {Client} client 
   */

  async execute(client) {

    mongoose.set("strictQuery", false);

    mongoose.connect(process.env.mongoURL, {
      // keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (mongoose.connect) {
      console.log("Conectado a la base de datos");
    }

    client.user.setPresence({
      activities: [
        {
          type: ActivityType.Custom,
          name:  `🌸 | ayuda`,
          state: `🌸 !help • Devil`,
          url: `https://discord.gg/QCnqeU2E`,
        },
      ],
      status: "idle",
    });
    loadCommands(client);
    loadPrefixCommands(client)
 },
};
