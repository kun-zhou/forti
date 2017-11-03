export default {
    //initializer
    initialize: initialize,
    // db related
    getDBList: getDBList,
    getDB: getDB,
    createDB: createDB,
    saveDB: saveDB,
    dbExists: dbExists,
    setDefaultDB: setDefaultDB,
    getDefaultDBLocation: getDefaultDBLocation,
    // color schemes related
    getDefaultColorScheme: getDefaultColorScheme,
    setDefaultColorScheme: setDefaultColorScheme,
    getColorSchemeList: getColorSchemeList,
    getColorScheme: getColorScheme,
    // templates related
    getTemplate: getTemplate,
    getTemplateList: getTemplateList,
}
/**
 * For both color schemes and templates,
 * defaults are pulled and appended by user-added entries.
 */
const uuid = require('uuid/v4');
const fs = require('fs-extra')
const path = require('path')
const crypto = require('crypto')
import io from './io'
const lockit_crypto = require('./lockit_crypto')

const pathConfigDir = path.join(require('electron').remote.app.getPath('appData'), 'lockit')
const pathConfig = path.join(pathConfigDir, 'config.json')
const pathInitialization = path.join('assets', 'user_content_dir')
const pathColorSchemes = path.join(pathConfigDir, 'color_schemes')
const pathTemplates = path.join(pathConfigDir, 'templates')

const pathDefaultColorSchemes = path.join('assets', 'default_color_schemes')
const pathDefaultTemplates = path.join('assets', 'default_templates')

var defaultColorSchemes = JSON.parse(fs.readFileSync(path.join(pathDefaultColorSchemes, 'manifest.json'), 'utf8'))
var defaultTemplates = JSON.parse(fs.readFileSync(path.join(pathDefaultTemplates, 'manifest.json'), 'utf8'))
var config = null

/***********************
 ** PUBLIC functions **
 ***********************/
/**
 * Initialization startup status emitted (only concerns database initialization). If a situation matches the decription of more than one of the following, the first in the list is emitted.
 * "NO_CONFIG" is emitted when the configuration file cannot be retrieved. A new lockit folder will be created in user config dir, and if an old lockit config folder already exist, it is included in the newly created config folder. 
 * "NO_DB_FOUND" is returned when no DBs are specified in the config, dbs
 * "INITIALIZED" is returned when the database file requested is found, along with the configuration of whether default database is selected or not. if selected, the database id (location) is also passed in the status response.
 */
function initialize() {
    // check configuration file existence
    try {
        config = JSON.parse(fs.readFileSync(pathConfig, 'utf8'))
    } catch (e) { // if config non-existent
        // copy default config
        fs.copySync(pathInitialization, pathConfigDir)
        config = JSON.parse(fs.readFileSync(pathConfig, 'utf8'))
        return { status: "WELCOME" }
    }

    return { status: 'SELECT_DB' }
}

// DATABASE RELATED
function createDB(name, passwd) {
    // default location for the new database
    var location = path.join(pathConfigDir, 'databases', uuid())
    // make sure no name overlap
    var overlap = false
    var dbs = config.dbs
    for (var i = 0; i < config.dbs.length; i++) {
        if (name === config.dbs[i]['name']) {
            overlap = true
        }
    }
    // create the db
    var db = JSON.parse(fs.readFileSync(path.join('assets', 'default_dbs', 'example_db.json'), 'utf8'))
    io.createDB(db, location, passwd)
    // update the config
    config.dbs.push({ name, location }) // add db to config
    config.last_accessed = location    // make it default
    saveConfig()
    return { name, location }
}

function getDB(location, passwd) { //idx index of the database
    return io.retrieveDB(location, passwd)
}

function getDBList() {
    // also return the status
    return config.dbs.map((db) => {
        return Object.assign({}, db, { exists: dbExists(db.location) })
    })
}

function dbExists(db_loc) {
    return fs.existsSync(db_loc)
}

function getDefaultDBLocation() {
    return config.default_db
}

function setDefaultDB(location) {
    config.default_db = location
    saveConfig()
}

function saveDB(db, location, passwd) {
    fs.writeFileSync(location, lockit_crypto.encrypt(JSON.stringify(db), passwd), 'utf8')
}

// Color Scheme Setup
function addColorScheme(scheme) {
    //fs.writeFileSync(path.join(pathColorSchemes, ))
}

function getDefaultColorScheme() {
    return config.color_scheme
}

function setDefaultColorScheme(scheme_file_name) {
    config.color_scheme = scheme_file_name
}

function getColorSchemeList() {
    // may be a bug because if webpack converts require(js_var)
    var all_schemes = []
    return all_schemes
        .push.apply(all_schemes, defaultColorSchemes)
        .push.apply(all_schemes, config.color_schemes)
}

function getColorScheme(scheme_file_name) { // returns actual css of color scheme
    // Check default color schemes first
    defaultColorSchemes.forEach((_scheme) => {
        if (_scheme.file_name === scheme_file_name) {
            return fs.readFileSync(path.join(pathDefaultColorSchemes, scheme_file_name), 'utf8')
        }
    })
    config.color_schemes.forEach((_scheme) => {
        if (_scheme.file_name === scheme_file_name) {
            return fs.readFileSync(path.join(pathColorSchemes, scheme_file_name), 'utf8')
        }
    })
    return fs.readFileSync(path.join(pathDefaultColorSchemes, defaultColorSchemes[0].file_name), 'utf8')
}

// Font Setup
function addTemplate() {

}

// Get Templates List
function getTemplateList() {
    return defaultTemplates.concat(config.templates)
}

function getTemplate(template_file_name) {
    // Check default color schemes first
    defaultTemplates.forEach((_template) => {
        if (_template.file_name === template_file_name) {
            return JSON.parse(fs.readFileSync(path.join(pathDefaultTemplates, template_file_name), 'utf8'))
        }
    })
    config.templates.forEach((_template) => {
        if (_template.file_name === template_file_name) {
            return JSON.parse(fs.readFileSync(path.join(pathTemplates, template_file_name), 'utf8'))
        }
    })
    return null
}

/***********************
 ** private functions **
 ***********************/

function defaultDBExists() {
    return fs.existsSync(config.default_db)
}

function saveConfig() {
    fs.writeFileSync(pathConfig, JSON.stringify(config), 'utf8')
}