const { model, Schema } = require('mongoose');

let configGuilds = new Schema({
    GuildId: {
        type: String,
        required: true
    },
    GuildLanguage: {
        type: String,
        required: true,
        default: 'es_LA'
    },
    GuildPrefix: {
        type: String, 
        required: true,
        default: '.'
    },
    CommandsDisabled: {
        type: Array
    },
    CategoriesDisabled: {
        type: Array
    }
});

module.exports = model('configGuilds', configGuilds);