const { model, Schema } = require('mongoose');

let aiSchema = new Schema({
    Guild: String,
    Channel: String
});

module.exports = model('aiSchema', aiSchema);
