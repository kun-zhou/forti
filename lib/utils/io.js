export default {
    createDB,
    retrieveDB
}

const fs = require('fs-extra')
const path = require('path')
const lockit_crypto = require('./lockit_crypto')

function createDB(db, location, passwd) { //db (JSON), name, path(optional), passwd
    fs.writeFileSync(
        location,
        lockit_crypto.encrypt(JSON.stringify(db), passwd),
        'utf8'
    )
    return { success: 0 }
}

function retrieveDB(location, passwd) {
    try {
        var encryptedDB = fs.readFileSync(location, 'utf8')
    } catch (e) {
        console.log("DB_NOT_FOUND" )
        return { sccuess: 1, message: "DB_NOT_FOUND" }
    }
    try {
        var decrypted_db = JSON.parse(lockit_crypto.decrypt(encryptedDB, passwd))
    }
    catch (e) {
        return { sccuess: 1, message: "PASSWORD_ERROR" }
    }
    return { success: 0, message: "UNLOCKED", payload: decrypted_db }
}

