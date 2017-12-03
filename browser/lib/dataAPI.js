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
import * as _crypto from './crypto'
import crypto from 'crypto'
import * as app_path from '../utils/paths'
import { debounce } from 'lodash'
import _ from 'lodash'

var vault_path = null,
    keyfile_loc = null,
    salt_and_iv_loc = null,
    cache_loc = null,
    secrets_loc = null,
    att_loc = null,
    enc_key = null
var debouncedFuncs = {}

function init(_vault_path, _passwd) { //return abstracts of notes
    // check if vault exist
    if (!fs.existsSync(_vault_path)) {
        return { success: false, message: 'VAULT_MISSING' }
    }
    // decrypt keyfile and verify
    vault_path = _vault_path
    keyfile_loc = path.join(vault_path, 'keyfile')
    salt_and_iv_loc = path.join(vault_path, 'salt_and_iv')
    cache_loc = path.join(vault_path, 'cache')
    secrets_loc = path.join(vault_path, 'secrets')
    att_loc = path.join(vault_path, 'attachments')
    // read keyfile
    try {
        var keyfile = fs.readFileSync(keyfile_loc)
        var salt_and_iv = fs.readFileSync(salt_and_iv_loc)
        /*
            cache is not examined here because it is regenerated if missing in readCache()
        */
        if (!fs.existsSync(secrets_loc)) {
            throw 'secrets missing'
        }
        if (!fs.existsSync(att_loc)) {
            throw 'attachments missing'
        }
    } catch (e) {
        return { success: false, message: 'VAULT_CORRUPTED', error: e }
    }
    // get encryption key
    try {
        enc_key = _crypto.getMasterKey(_passwd, keyfile, salt_and_iv)
    } catch (e) {
        return { success: false, message: 'PASSWORD_ERROR', error: e }
    }
    return { success: true, message: 'UNLOCKED' }
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

function readCache(force = false) {
    if (force) {
        return cacheRefreshRead()
    }
    try {
        var cache = JSON.parse(_crypto.readCryptSync(enc_key, cache_loc))
    } catch (e) {
        return cacheRefreshRead()
    }
    return { success: true, cache }
}

function cacheRefreshRead() {
    try {
        var cache = generateCache()
        _crypto.writeCryptSync(JSON.stringify(cache), enc_key, cache_loc)
    } catch (e) {
        return { success: false, message: 'force update cache failed', error: e }
    }
    return { success: true, cache }
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
    return { success: true, secret: secret }
}

function saveSecret(secret) { // create id if not exist
    if (!secretIsValid()) {
        return { success: false, message: 'secret is invalid' }
    }
    try {
        !debouncedFuncs[secret.id] ? debouncedFuncs[secret.id] = debounce(writeSecretToFile, 1000) : {}
        debouncedFuncs[secret.id](secret)
    } catch (e) {
        return { success: false, message: e }
    }
    return { success: true }
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
    _crypto.writeCryptSync(JSON.stringify(cache), enc_key, path.join(vault_path, 'cache'))
}

function createDemoVault(name, passwd, counts) { // will be large in nature
    var response = createVault(name, passwd)
    if (!response.success) return response
    init(response.location, passwd)
    for (var i = 0; i < counts; i++) {
        createSecret(Object.assign({ id: getUID() }, demoTemplate))
    }
    return response
}

function createVault(name, passwd) {
    // check if password is too short
    if (!passwd || passwd.length < 8) {
        return { success: false, message: "PASSWORD_INVALID" }
    }
    var vault_path = path.join(app_path.pathConfigDir, 'databases', uuid())
    // generate new encryption keyfile and keyss
    var response = _crypto.generateNewKeys(passwd)
    if (!response.success) {
        return { success: false, message: "KEYFILE_UNABLE" }
    }

    try { // try and check if directory already exist, if not, create it
        fs.mkdirSync(vault_path)
    } catch (e) {
        return { success: false, message: "VAULT_CREATION_UNABLE", error: e }
    }

    try {
        // write new keyfile and salt and iv, and directory structure
        fs.mkdirSync(path.join(vault_path, 'secrets'))
        fs.mkdirSync(path.join(vault_path, 'attachments'))
        fs.writeFileSync(path.join(vault_path, 'keyfile'), response.keyfile_encrypted)
        fs.writeFileSync(path.join(vault_path, 'salt_and_iv'), response.salt_and_iv)
    } catch (e) {
        fs.removeSync(vault_path) // it is safe here because we already know the directory vault_path is new (becase try fs.mkdir passes), so nothing is in there.
        return { success: false, error: e, message: 'vault cannot be created' }
    }
    return { success: true, location: vault_path }
}

function generateCache() { // should be only called in init.
    var cache = JSON.parse(fs.readFileSync(app_path.pathCacheTemplate, 'utf8'))
    var secrets = fs.readdirSync(secrets_loc)

    // create an array of secrets with time and add them to abstract
    var modified_dates = {}
    secrets = secrets.reduce((list, id) => {
        try {
            var secret = JSON.parse(_crypto.readCryptSync(enc_key, path.join(secrets_loc, id)))
        } catch (e) {
            console.log('encountered invalid secret')
            return list
        }
        cache.abstracts[id] = _.pick(secret, ['id', 'trash', 'title', 'attchment', 'snippet', 'tags', 'category', 'favorite'])
        modified_dates[id] = secret.time_modified
        list.push(id)
        return list
    }, [])

    // construct all keys sorted by time
    cache.all = secrets.sort((a, b) => (modified_dates[b] - modified_dates[a]))

    // construct favorites, categories and tags in one go
    for (let id of cache.all) {
        var secret = cache.abstracts[id]
        if (secret.favorite) cache.favorites.push(id)
        cache.categories[secret.category] ? cache.categories[secret.category].push(id) : cache.categories[secret.category] = [id]
        for (let tag of secret.tags) {

            cache.tags[tag] ? cache.tags[tag].push(id) : cache.tags[tag] = [id]
        }
    }
    return cache
}

function validateCache() { // regenerate if does timestamp passed
    // checkTimeStamp
    // check format
    return true
}

function secretIsValid() {
    return true
}

const demoTemplate = {
    "title": "Gmail Development Account",
    "attachment": false,
    "snippet": "john.dev@gmail.com",
    "category": "Login",
    "tags": [
        "work"
    ],
    "favorite": true,
    "time_created": 100,
    "time_modified": 1000,
    "user_defined": [
        {
            "title": "Basic Info",
            "fields": [
                ["Account", "john.dev@gmail.com", "text"],
                ["Password", "[aq,]F?wK|9812(s", "code"],
                ["Website", "https://mail.google.com", "link"]
            ]
        },
        {
            "title": "Extras",
            "fields": [["Note", "Gmail account for work at XYZ corp.", "note"]]
        }
    ],
    "snapshots": {}
}