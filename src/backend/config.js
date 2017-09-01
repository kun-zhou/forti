export default {
    //initializer
    initialize: initialize,
    //Getter
    retrieveDB: retrieveDB,
    createDB: createDB,
    saveDB: saveDB, /* (db) */
    getTemplate: getTemplate,
    getTemplateList: getTemplateList,
    getColorTheme: getColorTheme,

    //saveState: saveState, // save currently selected entry, nav entry
    //getState: getState, // save 
    //addTemplate: addTemplate,
    /*
    getDBLoc: getDBLoc,
    getColorTheme: getColorTheme,
    
    //Setter/Saver
    setDBLoc: setDBLoc,
    //setColorTheme: setColorTheme,
    //saveTemplate: saveTemplate,
    */
}

const fs = require('fs-extra')
const path = require('path')
const crypto = require('crypto')
const lockit_crypto = require('./lockit_crypto')

const pathConfigDir = path.join(require('electron').remote.app.getPath('appData'), 'lockit')
const pathConfig = path.join(pathConfigDir, 'config.json')
const pathInitialization = path.join('assets', 'initialization')
// this is used when app is being pacakged with electron-packager; this is a hack
//const pathInitialization = path.join(process.resourcesPath,'app', 'assets', 'initialization')
const pathThemes = path.join(pathConfigDir, 'themes')
const pathTemplates = path.join(pathConfigDir, 'templates')

var config = null
var password = null

/**
 * Initialize return various status. "NEED_INITIALIZATION" is emitted when the configuration file cannot be retrieved. "DATABASE_LOST" is returned when the database referenced in the config is not found. "DATABASE_LOCATED" is returned when the database file is found. 
 */
function initialize() {
    try {
        config = JSON.parse(fs.readFileSync(pathConfig, 'utf8'))
    } catch (e) {
        fs.copySync(pathInitialization, pathConfigDir)
        config = JSON.parse(fs.readFileSync(pathConfig, 'utf8'))
        return "HELLO_WORLD"
    }

    if (!fs.existsSync(getDBLoc())) {
        return "DATABASE_MISSING"
    }
    return "ENCRYPTED_DB_LOCATED"
}


function setDBLoc(path) {
    config.db_loc = path
    saveConfig()
}

function setColorTheme(path) {
    config.current_theme = path
    saveConfig()
}

function getDBLoc() {
    return config.db_loc
}

function getColorTheme() {
    return path.join(pathThemes, config.current_theme)
}

function getTemplateList() {
    var templates = []
    fs.readdirSync(pathTemplates).forEach(
        (file) => { if (file.includes('.json')) templates.push(file.slice(0, -5)) }
    )
    return templates
}

function getTemplate(template) {
    return JSON.parse(fs.readFileSync(path.join(pathTemplates, template + '.json'), 'utf-8'))
}

function createDB(name, masterPassword) { //name, path(optional), masterPassword
    //var db = { "favorites": ["MLeaFwKqZDghlghmIL+bXihHerva", "Zr0H8nj7/ZEoNSUUxNhUoLOE5UUk"], "categories_order": ["Login", "Secure Note", "Credit Card"], "categories_icon": { "Login": "fa-key", "Secure Note": "fa-sticky-note-o", "Credit Card": "fa-credit-card" }, "tags_order": ["financial", "project Q", "work", "personal"], "tags_color": { "financial": "#cb636c", "project Q": "#ce8383", "work": "#d0a299", "personal": "#d0bfae" }, "categories_keys": { "Login": ["qw4BhTDoZgdqNWBeYzs1epU/suey", "Zr0H8nj7/ZEoNSUUxNhUoLOE5UUk", "MLeaFwKqZDghlghmIL+bXihHerva"], "Secure Note": [], "Credit Card": [] }, "tags_keys": { "financial": ["Zr0H8nj7/ZEoNSUUxNhUoLOE5UUk"], "project Q": ["MLeaFwKqZDghlghmIL+bXihHerva"], "work": ["qw4BhTDoZgdqNWBeYzs1epU/suey", "MLeaFwKqZDghlghmIL+bXihHerva"], "personal": ["Zr0H8nj7/ZEoNSUUxNhUoLOE5UUk"] }, "all_keys": ["MLeaFwKqZDghlghmIL+bXihHerva", "Zr0H8nj7/ZEoNSUUxNhUoLOE5UUk", "qw4BhTDoZgdqNWBeYzs1epU/suey"], "trash_keys": [], "entries": { "MLeaFwKqZDghlghmIL+bXihHerva": { "id": "MLeaFwKqZDghlghmIL+bXihHerva", "title": "Gmail - Dev Account", "snippet": "clowindy.kun@gmail.com", "category": "Login", "favorite": true, "tags": ["work", "project Q"], "attachment_block": false, "advanced": false, "time_created": "1242412", "time_modified": "1242412", "sections_display": [true, false], "sections_order": ["default", "extras"], "sections": { "default": ["asd", "asdas", "q212"], "extras": ["as1d"] }, "user_defined": { "asd": ["Account", "clowindy@gmail.com", "text"], "asdas": ["Password", "[aq,]F?wK|9812(s", "passcode"], "q212": ["Website", "https://mail.google.com", "url"], "as1d": ["Note", "This is a brilliant note", "note"] } }, "Zr0H8nj7/ZEoNSUUxNhUoLOE5UUk": { "id": "Zr0H8nj7/ZEoNSUUxNhUoLOE5UUk", "title": "Fastmail - Personal Account", "snippet": "kunzhou@fastmail.com", "category": "Login", "favorite": true, "tags": ["financial", "personal"], "attachment_block": false, "advanced": false, "time_created": "1242413", "time_modified": "1242413", "sections_display": [true, false], "sections_order": ["Basic Info", "extras"], "sections": { "Basic Info": ["asd", "asdas", "q212"], "extras": ["as1d"] }, "user_defined": { "asd": ["Account", "kunzhou@fastmail.com", "text"], "asdas": ["Password", "K|9[aq,]F?w812(s", "passcode"], "q212": ["Website", "https://www.fastmail.com", "url"], "as1d": ["Note", " This is yet another brilliant note", "note"] } }, "qw4BhTDoZgdqNWBeYzs1epU/suey": { "id": "qw4BhTDoZgdqNWBeYzs1epU/suey", "title": "Github - Work Account", "snippet": "kunzhou@github.com", "category": "Login", "favorite": false, "tags": ["work"], "attachment_block": false, "advanced": false, "time_created": "1242415", "time_modified": "1242415", "sections_display": [true, false], "sections_order": ["Basic Info", "mysterious"], "sections": { "Basic Info": ["asd", "asdas", "q212"], "mysterious": ["as1d"] }, "user_defined": { "asd": ["Account", "kunzhou@github.com", "text"], "asdas": ["Password", "a81q,]F?wK|q9812(s", "passcode"], "q212": ["Website", "https://www.github.com", "url"], "as1d": ["Note", " This is another brilliant note", "note"] } } }, "snapshots": { "qw4BhTDoZgdqNWBeYzs1epU/suey": { "1242415": { "id": "qw4BhTDoZgdqNWBeYzs1epU/suey", "title": "Github - Work Account", "snippet": "kunzhou@github.com", "category": "Login", "favorite": false, "tags": ["work"], "attachment_block": false, "advanced": false, "time_created": "1242415", "time_modified": "1242415", "sections_display": [true, false], "sections_order": ["Basic Info", "mysteriouss"], "sections": { "Basic Info": ["asd", "asdas", "q212"], "mysterious": ["as1d"] }, "user_defined": { "asd": ["Account", "kunzhou@github.com", "text"], "asdas": ["Password", "a81q,]F?wK|q9812(s", "passcode"], "q212": ["Website", "https://www.github.com", "url"], "as1d": ["Note", " This is another brilliant note", "note"] } } } } }
    var db = JSON.parse(fs.readFileSync(path.join(pathConfigDir, 'template.json')))
    var _path = path.join(pathConfigDir, 'db', name + '.json')
    fs.writeFileSync(
        _path,
        lockit_crypto.encrypt(JSON.stringify(db), masterPassword),
        'utf8'
    )
    config.db_loc = _path
    saveConfig()
    return db
}

function retrieveDB(masterPassword) {
    try {
        var encryptedDB = fs.readFileSync(getDBLoc(), 'utf8')
        var response = { success: 0, message: "DATABASE_DECRYPTED", payload: JSON.parse(lockit_crypto.decrypt(encryptedDB, masterPassword)) }
        password = masterPassword
        return response
    } catch (e) {
        return { sccuess: 1, message: "PASSWORD_ERROR" }
    }
}

function saveConfig() {
    fs.writeFileSync(pathConfig, JSON.stringify(config), 'utf8')
}

function saveDB(db) {
    if (password === null) return
    fs.writeFileSync(getDBLoc(), lockit_crypto.encrypt(JSON.stringify(db), password), 'utf8')
}
