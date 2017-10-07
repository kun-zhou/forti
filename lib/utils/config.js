export default {
    //initializer
    initialize: initialize,
    // db related
    getDBList: getDBList,
    getDB: getDB,
    createDB: createDB,
    saveDB: saveDB,
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

var defaultColorSchemes = JSON.parse(fs.readFileSync('assets/default_color_schemes/manifest.json', 'utf8'))
var defaultTemplates = JSON.parse(fs.readFileSync('assets/default_templates/manifest.json', 'utf8'))
var config = null

/***********************
 ** PUBLIC functions **
 ***********************/
/**
 * Initialize startup status. 
 * "NO_CONFIG" is emitted when the configuration file cannot be retrieved. 
 * "NO_DB_FOUND" is returned when no one DB is specified in the config
 * "DB_LOCATED" is returned when the default database file is found. 
 * "DEFAULT_DB_LOST" if the default database specified is not found.
 * "NO_DEFAULT_DB_SET" if default DB is not set
 */
function initialize() {
    // check configuration file existence
    try {
        config = JSON.parse(fs.readFileSync(pathConfig, 'utf8'))
    } catch (e) { // if config non-existent
        // copy default config
        fs.copySync(pathInitialization, pathConfigDir)
        config = JSON.parse(fs.readFileSync(pathConfig, 'utf8'))
        return { status: "NO_CONFIG" }
    }
    // check if any db exist
    if (config.dbs.length === 0) {
        return { status: "NO_DB_FOUND" }
    }
    // check database existence
    if (config.openDefaultDBOnStartUp) {
        if (defaultDBExists()) {
            return { status: 'DB_LOCATED' }
        } else {
            return { status: 'DEFAULT_DB_LOST' }
        }
    }
    return { status: 'NO_DEFAULT_DB_SET' } //should prompt user to select one
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
    config.default_db = location    // make it default
    saveConfig()
}

function getDB(location, passwd) { //idx index of the database
    return io.retrieveDB(location, passwd)
}

function getDBList() {
    return config.dbs
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
    return config.default_color_scheme
}

function setDefaultColorScheme(scheme_file_name) {
    config.default_color_scheme = scheme_file_name
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
            return fs.readFileSync(path.join('assets', 'default_color_schemes', scheme_file_name), 'utf8')
        }
    })
    config.color_schemes.forEach((_scheme) => {
        if (_scheme.file_name === scheme_file_name) {
            return fs.readFileSync(path.join(pathColorSchemes, scheme_file_name), 'utf8')
        }
    })
    return fs.readFileSync(path.join('assets', 'default_color_schemes', defaultColorSchemes[0].file_name), 'utf8')
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
            return JSON.parse(fs.readFileSync(path.join('assets', 'default_templates', template_file_name), 'utf8'))
        }
    })
    config.templates.forEach((_template) => {
        if (_template.file_name === template_file_name) {
            return JSON.parse(fs.readFileSync(path.join(pathColorSchemes, template_file_name), 'utf8'))
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