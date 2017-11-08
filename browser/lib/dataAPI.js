/**
 * This API manages data IO and database initialization
 */
export default {
    init,
    readSecret,
    saveSecret,
    readAttachment,
    saveAttachment,
    readManifest,
    readCache,
    saveCache,
    createVault,
    createDemoVault
}
import uuid from 'uuid/v4'
import { readCryptSync, writeCryptSync, generateNewKeys } from './crypto'
import path from 'path'
import fs from 'fs-extra'
import * as app_path from '../utils/paths'

var vault_path = null,
    passwd = null,
    key = null

function init(_vault_path, _passwd) { //return abstracts of notes
    // decrypt keyfile and verify
    vault_path = _vault_path
    passwd = _passwd
    // read Cache
    validateCache(vault_path, passwd)

    return { success: true, message: 'UNLOCKED', key: '' }
}

function readManifest() {
    return { manifest: JSON.parse(fs.readFileSync(path.join(vault_path, 'manifest.json'), 'utf8')) }
    //var manifest = readCryptSync(vault_path, crypto.pbkdf2(passwd, 'salt', 100000, 256, 'sha512'))
}

function readCache() {
    return { cache: JSON.parse(fs.readFileSync(path.join(vault_path, 'cache.json'))) }
    //var secretsCache = JSON.parse(readCryptSync(path.join(vault_path, 'cache.cjson'), passwd))
}

function readSecret(uid) {
    return { secret: JSON.parse(fs.readFileSync(path.join(vault_path, 'secrets', String(uid)), 'utf8')) }
    //return JSON.parse(readCryptSync(path.join(vault_path, 'secrets', uid), passwd))
}

function saveSecret(uid, secret) {
    if (!secretIsValid()) {
        return { success: 1, message: 'secret is invalid' }
    }
    try {
        fs.writeFileSync(path.join(vault_path, 'secrets', uid), JSON.stringify(secret))
        //writeCryptSync(path.join(vault_path, 'secrets', uid), JSON.stringify(secret), passwd)
    } catch (e) {
        return { success: 1, message: e }
    }
    return { success: 0 }
}

function createManifest(path, _manifest, passwd) {
    var { prekey } = generateNewKeys(passwd)
    writeCryptSync(path, JSON.stringify(_manifest), preKey)
}

function readAttachment(vault_path, uid, passwd) {
    return JSON.parse(readCryptSync(path.join(vault_path, 'secrets', uid), passwd))
}

function saveAttachment(vault_path, uid, attachment_loc, passwd) {
    // TBD
}

function saveCache(cache) {
    writeCryptSync(path.join(vault_path, 'cache.cjson'), JSON.stringify(cache), passwd)
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