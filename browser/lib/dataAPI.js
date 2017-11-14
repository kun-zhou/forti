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
import { readCryptSync, writeCryptSync, generateNewKeys } from './crypto'
import path from 'path'
import fs from 'fs-extra'
import crypto from 'crypto'
import * as app_path from '../utils/paths'
import { debounce } from 'lodash'

var vault_path = null,
    passwd = null,
    key = null
var debouncedFuncs = {}

function init(_vault_path, _passwd) { //return abstracts of notes
    // decrypt keyfile and verify
    vault_path = _vault_path
    passwd = _passwd
    // read Cache
    validateCache(vault_path, passwd)

    return { success: true, message: 'UNLOCKED', key: '' }
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
    return { cache: JSON.parse(fs.readFileSync(path.join(vault_path, 'cache.json'))) }
    //var secretsCache = JSON.parse(readCryptSync(path.join(vault_path, 'cache.cjson'), passwd))
}

function readSecret(uid) {
    flushDebouncedFuncs()
    return { secret: JSON.parse(fs.readFileSync(path.join(vault_path, 'secrets', uid), 'utf8')) }
    //return JSON.parse(readCryptSync(path.join(vault_path, 'secrets', uid), passwd))
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
        //writeCryptSync(path.join(vault_path, 'secrets', uid), JSON.stringify(secret), passwd)
    } catch (e) {
        return { success: 1, message: e }
    }
    return { success: 0 }
}

function writeSecretToFile(secret) {
    fs.writeFileSync(path.join(vault_path, 'secrets', secret.id), JSON.stringify(secret))
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
    fs.writeFileSync(path.join(vault_path, 'cache.json'), JSON.stringify(cache))
}

function createDemoVault(name, passwd) {
    var vault_path = path.join(app_path.pathConfigDir, 'databases', uuid())
    var demo_vault_path = path.join('assets', 'default_dbs', 'Demo')
    fs.copySync(demo_vault_path, vault_path)
    return { location: vault_path }
}

function createVault(name, passwd) {
    var vault_dir_name = uuid()

    var vault_path = path.join(pathInitialization, 'databases', vault_dir_name)
    /*
    var secrets_path = path.join(vault_path, 'secrets')
    var attachments_path = path.join(vault_path, 'attachments')
    fs.mkdirSync(vault_path)
    fs.mkdirSync(secrets_path)
    fs.mkdirSync(attachments_path)
    var cache = '{}'
    var manifest = '{}'
    fs.writeFileSync(vault_path, JSON.stringify(cache))
    */
    fs.copySync(pathInitialization, vault_path)
    return { location: vault_path }
}

function validateCache() { // regenerate if does timestamp passed
    // checkTimeStamp
    // check format
    return true
}

function secretIsValid() {
    return true
}