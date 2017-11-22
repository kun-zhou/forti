/**
 * This API manages all crypto aspects of the vaults
 */
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const keyfileName = 'keyfile'
const algorithm = 'aes-256-gcm'
// path represents vault path
function encrypt(text, key, iv) {
    var cipher = crypto.createCipher(algorithm, key, iv)
    var crypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return crypted
}

function decrypt(buffer, key, iv) {
    console.log(buffer, key, iv)
    var decipher = crypto.createDecipher(algorithm, key, iv)
    var dec = decipher.update(buffer, 'utf8')
    return dec
}

// test for encrypt decrypt

function getMasterKey(passwd, keyfile, salt_and_iv) { // keyfile should be buffer
    // get salt and iv
    var salt = Buffer.alloc(16)
    var iv = Buffer.alloc(16)
    salt_and_iv.copy(salt, 0, 0, 16)
    salt_and_iv.copy(iv, 0, 16, 32)

    // get keyfile_key and verification keys
    var { keyfile_key, verification_key } = deriveKey(passwd, salt)

    // decrypt keyfile
    var algorithm = 'aes-256-gcm'
    var decipher = crypto.createDecipheriv(algorithm, keyfile_key, iv)
    decipher.write(keyfile)
    //decipher.end()
    var keyfile_plain = decipher.read()
    var actual_vkey = Buffer.alloc(32)
    keyfile_plain.copy(actual_vkey, 0, 0, 32)
    if (!actual_vkey.equals(verification_key)) {
        throw 'wrong password or corrupted keyfile'
    }
    var enc_key = Buffer.alloc(32)
    keyfile_plain.copy(enc_key, 0, 32, 64)
    return enc_key
}

function generateNewKeys(passwd) {
    var enc_key = crypto.randomBytes(32) // master encryption key
    var iv = crypto.randomBytes(16)
    var salt = crypto.randomBytes(16)

    var { keyfile_key, verification_key } = deriveKey(passwd, salt)

    var keyfile = Buffer.concat([verification_key, enc_key])
    console.log(keyfile)
    var salt_and_iv = Buffer.concat([salt, iv]);

    var algorithm = 'aes-256-gcm'
    var cipher = crypto.createCipheriv(algorithm, keyfile_key, iv)
    cipher.write(keyfile)
    cipher.end()
    var keyfile_encrypted = cipher.read()

    return { success: 0, keyfile_encrypted, salt_and_iv, enc_key }
}

function deriveKey(passwd, salt) {
    var keyfile_key = Buffer.alloc(32)
    var verification_key = Buffer.alloc(32)
    var dervied_keys = crypto.pbkdf2Sync(passwd, salt, 8000, 512, 'sha512')
    dervied_keys.copy(keyfile_key, 0, 0, 32)
    dervied_keys.copy(verification_key, 0, 32, 64)
    return {
        keyfile_key,
        verification_key
    }
}

function readCryptSync(key, path) {
    var content = fs.readFileSync(path)
    var iv = Buffer.alloc(16)
    var secret = Buffer.alloc(content.length - 16)
    content.copy(iv, 0, 0, 16)
    content.copy(secret, 0, 16, content.length)
    var secret_plain = decrypt(secret, key, iv)
    console.log()
    return secret_plain
}

function writeCryptSync(secret, key, path) {
    var iv = crypto.randomBytes(16)
    var content = Buffer.concat([iv, encrypt(secret, key, iv)])
    fs.writeFileSync(path, content)
}

module.exports = { readCryptSync, writeCryptSync, generateNewKeys, getMasterKey }