const { model, Schema } = require('mongoose');

let autorolschema = new Schema({
    serverId: String,
    roleId1: String,
});

module.exports = model('autorolschema', autorolschema);