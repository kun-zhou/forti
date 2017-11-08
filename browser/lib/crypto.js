/**
 * This API manages all crypto aspects of the vaults
 */
const crypto = require('crypto'), algorithm = 'aes-256-ctr'
const fs = require('fs')

const keyfileName = 'keyfile'
// path represents vault path
function encrypt(text, key) {
    var cipher = crypto.createCipher(algorithm, key)
    var crypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return crypted;
}

function decrypt(buffer, key) {
    var decipher = crypto.createDecipher(algorithm, key)
    var dec = decipher.update(buffer, 'utf8') + decipher.final('utf8')
    return dec;
}

function getMasterKey(path) {
    return decrypt(fs.readFileSync(path.join(path, keyfileName)),crypto.pbkdf2(passwd, 'lockit', 100000, 256, 'sha512'))
}

function generateNewKeys(path, passwd) {
    var keys = {
        preKey: crypto.pbkdf2(passwd, 'lockit', 100000, 256, 'sha512'),
        masterKey: crypto.randomBytes(256)
    }
    var cipher = crypto.createCipher(algorithm, passwd)
    var prekey_encrypted = Buffer.concat([cipher.update(preKey), cipher.final()]);
    fs.writeFileSync(prekey_encrypted, path)
    return keys
}

function readCryptSync(path, passwd) {
    return decrypt(fs.readFileSync(path), passwd)
}

function writeCryptSync(text, passwd) {
    fs.writeFileSync(encrypt(text, passwd))
}

module.exports = { readCryptSync, writeCryptSync, generateNewKeys }