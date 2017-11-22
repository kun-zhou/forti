/**
 * This API manages data IO and database initialization.
 */
export default {
    init,
    getUID,
    readSecret,
    createSecret,
    deleteSecret,
    saveSecret,
    readAttachment,
    saveAttachment,
    readCache,
    saveCache,
    createVault,
    createDemoVault,
    closeVault
}
import uuid from 'uuid/v4'
import path from 'path'
import fs from 'fs-extra'
import _crypto from './crypto'
import crypto from 'crypto'
import * as app_path from '../utils/paths'
import { debounce } from 'lodash'

var vault_path = null,
    keyfile_loc = null,
    salt_and_iv_loc = null,
    cache_loc = null,
    secrets_loc = null,
    att_loc = null,
    enc_key = null
var debouncedFuncs = {}

function init(_vault_path, _passwd) { //return abstracts of notes
    // decrypt keyfile and verify
    vault_path = _vault_path
    keyfile_loc = path.join(vault_path, 'keyfile')
    salt_and_iv_loc = path.join(vault_path, 'salt_and_iv')
    cache_loc = path.join(vault_path, 'cache')
    secrets_loc = path.join(vault_path, 'secrets')
    try {
        enc_key = _crypto.getMasterKey(_passwd, fs.readFileSync(keyfile_loc), fs.readFileSync(salt_and_iv_loc))
    } catch (e) {
        console.log(e)
        return { success: 1, message: 'PASSWORD_ERROR' }
    }
    return { success: 0, message: 'UNLOCKED' }
}

function getUID() {
    flushDebouncedFuncs()// flushing is necessary so UID of the pending write does not get obtained
    var ids = fs.readdirSync(path.join(vault_path, 'secrets')),
        length = 5
    var id = crypto.randomBytes(length).toString('hex')
    while (ids.includes(id)) {
        length++
        id = crypto.randomBytes(length).toString('hex')
    }
    return id
}

function closeVault(cache) {
    flushDebouncedFuncs()
    saveCache(cache)
}

function flushDebouncedFuncs() {
    for (var func in debouncedFuncs) {
        debouncedFuncs[func].flush()
        delete debouncedFuncs.func
    }
}

function readCache() {
    console.log('cacje_;')
    console.log(cache_loc)
    return { cache: JSON.parse(_crypto.readCryptSync(enc_key, cache_loc)) }
}

function readSecret(uid) {
    flushDebouncedFuncs()
    return { secret: JSON.parse(_crypto.readCryptSync(enc_key, path.join(secrets_loc, uid))) }
}

function createSecret(secret) {
    if (!secret.id) {
        throw 'Secret has not been assigned id'
    }
    var current_time = (new Date()).getTime()
    secret.date_modified = current_time
    secret.date_created = current_time
    writeSecretToFile(secret)
    return { success: 0, secret: secret }
}

function saveSecret(secret) { // create id if not exist
    if (!secretIsValid()) {
        return { success: 1, message: 'secret is invalid' }
    }
    try {
        !debouncedFuncs[secret.id] ? debouncedFuncs[secret.id] = debounce(writeSecretToFile, 1000) : {}
        debouncedFuncs[secret.id](secret)
    } catch (e) {
        return { success: 1, message: e }
    }
    return { success: 0 }
}

function writeSecretToFile(secret) {
    _crypto.writeCryptSync(JSON.stringify(secret), enc_key, path.join(secrets_loc, secret.id))
}

function deleteSecret(id) {
    fs.unlinkSync(path.join(vault_path, 'secrets', id))
}


function readAttachment(vault_path, uid, passwd) {
    return JSON.parse(readCryptSync(path.join(vault_path, 'secrets', uid), passwd))
}

function saveAttachment(vault_path, uid, attachment_loc, passwd) {
    // TBD
}

function saveCache(cache) {
    _crypto.writeCryptSync(JSON.stringify(cache), enc_key, path.join(vault_path, 'cache'), )
}

function createDemoVault(name, passwd) {
    var vault_path = path.join(app_path.pathConfigDir, 'databases', uuid())
    var demo_vault_path = path.join(require('electron').remote.app.getAppPath(), 'assets', 'default_dbs', 'Demo')
    fs.copySync(demo_vault_path, vault_path)
    return { location: vault_path }
}

function createVault(name, passwd) {
    if (!passwd || passwd.length < 5) {
        return { success: 1, message: "password too short or corrupted" }
    }
    var vault_path = path.join(app_path.pathConfigDir, 'databases', uuid())
    // generate new encryption keyfile and keyss
    var response = _crypto.generateNewKeys(passwd)
    if (response.success !== 0) {
        return { success: 1, message: "failed to create keyfile" }
    }

    // generate fresh cache
    try {
        var cache = generateCache()
    } catch (e) {
        return { success: 1, message: "failed to generate cache" + e }
    }

    // write new keyfile and salt and iv, and directory structure
    fs.mkdirSync(vault_path)
    fs.mkdirSync(path.join(vault_path, 'secrets'))
    fs.mkdirSync(path.join(vault_path, 'attachments'))
    _crypto.writeCryptSync(JSON.stringify(cache), response.enc_key, path.join(vault_path, 'cache'))
    fs.writeFileSync(path.join(vault_path, 'keyfile'), response.keyfile_encrypted)
    fs.writeFileSync(path.join(vault_path, 'salt_and_iv'), response.salt_and_iv)
    return { success: 0, location: vault_path }
}

function generateCache(vault_path) {
    // for now, just implement generate cache for empty vault
    return JSON.parse(fs.readFileSync(app_path.pathCacheTemplate, 'utf8'))
}

function validateCache() { // regenerate if does timestamp passed
    // checkTimeStamp
    // check format
    return true
}

function secretIsValid() {
    return true
}