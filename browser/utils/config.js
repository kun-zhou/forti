export default {
    //initializer
    initialize: initialize,
    // db related
    getDBList: getDBList,
    getDB: getDB,
    addDB: addDB,
    saveDB: saveDB,
    dbExists: dbExists,
    setDefaultDB: setDefaultDB,
    getDefaultDBLocation: getDefaultDBLocation,
    // color schemes related
    appendTagColors: appendTagColors,
    setDefaultColorScheme: setDefaultColorScheme,
    getColorSchemeList: getColorSchemeList,
    getColorScheme: getColorScheme,
    // templates related
    getCategories: getCategories,
    getTemplate: getTemplate,
    getTemplateList: getTemplateList,
}
/**
 * For both color schemes and templates,
 * defaults are pulled and appended by user-added entries.
 */
import hashbow from 'hashbow'
const uuid = require('uuid/v4');
const fs = require('fs-extra')
const path = require('path')
const crypto = require('crypto')
import _ from 'lodash'
const lockit_crypto = require('./lockit_crypto')

const appPath = require('electron').remote.app.getAppPath()
const pathConfigDir = path.join(require('electron').remote.app.getPath('appData'), 'lockit')
const pathConfig = path.join(pathConfigDir, 'config.json')
const pathInitialization = path.join(appPath, 'assets', 'user_content_dir')
const pathColorSchemes = path.join(pathConfigDir, 'color_schemes')
const pathTemplates = path.join(pathConfigDir, 'templates')

const pathDefaultColorSchemes = path.join(appPath, 'assets', 'default_color_schemes')
const pathDefaultTemplates = path.join(appPath, 'assets', 'default_templates')

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
function addDB(name, location) {
    // update the config
    config.dbs.push({ name, location }) // add db to config
    config.last_accessed = location    // make it default
    saveConfig()
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

function setDefaultColorScheme(scheme_file_name) {
    return fs.readFileSync(path.join(pathDefaultColorSchemes, defaultColorSchemes[0].file_name), 'utf8')
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

// append colors for tags
function appendTagColors(tags) { //tags is an iterator
    var tag_and_color = []
    for (var tag of tags) {
        tag_and_color.push([tag, '#A0D3F9'])
    }
    return new Map(tag_and_color)
}

// get Manifest
function getCategories() {
    return defaultTemplates.map((template) => [template.name, template.icon])
}
// Get Templates List
function getTemplateList() {
    return defaultTemplates.concat(config.templates)
}

function getTemplate(template_name) { // NEED to ADD USER TEMPLATE
    var template_file_name = null
    for (var template of defaultTemplates) {
        if (template.name === template_name) {
            return JSON.parse(fs.readFileSync(path.join(pathDefaultTemplates, template.file_name), 'utf8'))
            break;
        }
    }

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