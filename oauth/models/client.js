var clients = require('./data.js').clients;
var codes = require('./data.js').codes;

const orm = require('../../utils/model')
const Client = orm.model('Client')

module.exports.getId = function(client, cb) {
    cb(null, client.id);
};

module.exports.fetchById = async function(clientId, cb) {
    const client = await Client.findOne({ where: { id: clientId } })
    cb(null, client)
};

module.exports.checkSecret = function(client, secret, cb) {
    return cb(null, client.secret == secret);
};

module.exports.getRedirectUri = function (client, cb) {
    cb(null, client.redirectUri);
};

module.exports.checkRedirectUri = function (client, redirectUri) {
    return (redirectUri.indexOf(getRedirectUri(client)) === 0 &&
            redirectUri.replace(getRedirectUri(client), '').indexOf('#') === -1);
};

module.exports.checkScope = function(client, scope, cb) {
    cb(null, scope);
};

module.exports.transformScope = function(scope, cb) {
    if (!scope) return [];
    cb(null, scope.split(' '));
};

module.exports.checkGrantType = function(client, grant, cb) {
    if (client.grants.indexOf(grant) !== -1) cb(null, true);
    else cb(null, false);
};