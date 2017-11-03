export default {
    createDB,
    retrieveDB
}

const fs = require('fs-extra')
const path = require('path')
const lockit_crypto = require('./lockit_crypto')

function createDB(db, location, passwd) { //db (JSON), name, path(optional), passwd
    console.log('creating new DB', db, location, passwd)
    fs.writeFileSync(
        location,
        lockit_crypto.encrypt(JSON.stringify(db), passwd),
        'utf8'
    )
    return { success: 0 }
}

/**
 * retrieve database according to location and password
 * @param {*} location full file address of the database
 * @param {*} passwd  password of that database
 */
function retrieveDB(location, passwd) {
    try {
        var encryptedDB = fs.readFileSync(location, 'utf8')
    } catch (e) {
        console.log("DB_MISSING")
        return { sccuess: 1, message: "DB_MISSING" }
    }
    try {
        var decrypted_db = JSON.parse(lockit_crypto.decrypt(encryptedDB, passwd))
    }
    catch (e) {
        console.log(e)
        return { sccuess: 1, message: "PASSWORD_ERROR" }
    }
    return { success: 0, message: "UNLOCKED", payload: decrypted_db }
}