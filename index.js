const { Client, GatewayIntentBits, Collection, Partials, Options, apexify, } = require('discord.js');
require("./Functions/anticrash.js")();
require("dotenv").config();
const { join } = require('path');
const process = require("node:process");
const { logHandler } = require("./Handlers/auditlogHandler");
const { loadMenus } = require("./Handlers/menuHandler");
const { loadModals } = require("./Handlers/modalHandler");
const { loadEvents } = require("./Handlers/eventHandler");
const { loadButtons } = require("./Handlers/buttonHandler");
 require('captcha-canvas');
 const qr = require('qr-image');

const client = new Client({
	intents: [
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.AutoModerationConfiguration,
		GatewayIntentBits.AutoModerationExecution,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildScheduledEvents,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildPresences,
	],
	partials: [
        Partials.User,
        Partials.Message,
        Partials.GuildMember,
        Partials.ThreadMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.Channel
    ],
	sweepers: {
		...Options.DefaultSweeperSettings,
		messages: {
			interval: 3_600,
			lifetime: 1_800,
		},
		users: {
			interval: 3_600,
			filter: () => user => user.bot && user.id !== user.client.user.id
		}
	},
	allowedMentions: {
        parse: ["users", "roles", "everyone"],
        repliedUser: false
    },
	cooldowns: 5
});

client.events = new Collection();
client.commands = new Collection();
client.cooldowns = new Collection();
client.prefixCommands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.menus = new Collection();

client.languages = require('i18n');
client.languages.configure({
	locales: ['es_LA', 'en_US', 'pt_BR'],
	directory: join(__dirname, "locales"),
	defaultLocale: 'es_LA',
	retryInDefaultLocale: true,
	objectNotation: true,
	register: global,

	logWarnDn: function (msg) {
		console.log('[WARN] ' + msg);
	},

	logErrorFn: function (msg) {
		console.log('[ERROR] ' + msg);
	},

	missingKeyFn: function (value) {
		return value;
	},

	mustacheConfig: {
		tags: ['{{', '}}'],
		disable: false
	}
});

loadEvents(client);
loadButtons(client);
loadModals(client);
loadMenus(client);

// Definir estas dos lineas 

const { handleSpamDetection } = require("./Events/Guild/spamDetection.js");
const spamDetection = require("./Schemas/spamDetection");


// Evento messageCreate 
// spam detection
client.on("messageCreate", async (message) => {
	// detectar cada mensaje
	if (!message.guild) {
		return; // Ignorar mensajes directos
	}
	const spamDel = await spamDetection.findOne({
		// buscar el servidor em la base de datos
		guildId: message.guild.id,
	});
	if (message.channelId === spamDel?.permCh) return;

	if (spamDel) {
		handleSpamDetection(message, spamDel.maxDuplicate || 2); // ejecutar la funcion si el servidor esta en la base de datos
	} else {
		return;
	}
});

// prueba si no la elimino 

client.login(process.env.token);
logHandler(client);

//
// este responde solo si mandan hola, si mandan otra frase en el mismo mensaje no hace nada
client.on('messageCreate', (message) => {
    if (message.author.bot) return; // Ignorar mensajes enviados por otros bots
  
    if (message.content.toLowerCase() === 'ip') {
      message.reply('🔴Aun es en mantenimiento el servidor sea paciente a que termine su mantenimiento  :3'); // Responder al mensaje de "hola"
    }
  });
  
  
  
  // este hace que si mandan un mensaje y tiene la palabra en especifico aunque tenga muchas palabras mas igual va a tomar en cuenta ese mensaje
  client.on('messageCreate', (message) => {
    if (message.author.bot) return; // Ignorar mensajes enviados por otros bots
  
    const palabraClave = 'hola'; // Palabra que deseas detectar
  
    if (message.content.toLowerCase().includes(palabraClave)) {
      message.reply('¡Hola! ¿Cómo estas? :3'); // Responder al mensaje que contiene la palabra clave
    }
  });