export default {
    //initializer
    initialize : initialize,
    // db related
    getDBList : getDBList,
    addDB : addDB,
    setDefaultDB : setDefaultDB,
    getDefaultDBLocation : getDefaultDBLocation,
    // color schemes related
    setColorScheme : setColorScheme,
    getColorSchemeList : getColorSchemeList,
    getColorScheme : getColorScheme,
    // templates related
    getCategories : getCategoryIconList,
    getTemplate : getCategoryTemplate,
    getTemplateList : getCategoryList
}
/**
 * For both color schemes and templates,
 * defaults are pulled and appended by user-added entries.
 */
const fs = require('fs-extra')
const path = require('path')

// paths relative to the app
const appPath = require('electron')
    .remote
    .app
    .getAppPath()
const pathInitialization = path.join(appPath, 'assets', 'user_content_dir')
const pathDefaultColorSchemes = path.join(appPath, 'assets', 'default_color_schemes')
const pathDefaultTemplates = path.join(appPath, 'assets', 'default_templates')

// paths relative to the config
const pathConfigDir = path.join(require('electron').remote.app.getPath('appData'), 'lockit')
const pathConfig = path.join(pathConfigDir, 'config.json')
const pathColorSchemes = path.join(pathConfigDir, 'color_schemes')
const pathTemplates = path.join(pathConfigDir, 'templates')

var defaultColorSchemes = JSON.parse(fs.readFileSync(path.join(pathDefaultColorSchemes, 'manifest.json'), 'utf8'))
var defaultTemplates = JSON.parse(fs.readFileSync(path.join(pathDefaultTemplates, 'manifest.json'), 'utf8'))
var config = null

/***********************
 ** PUBLIC functions **
 ***********************/

function initialize() {
    // check configuration file existence
    try {
        config = JSON.parse(fs.readFileSync(pathConfig, 'utf8'))
    } catch (e) { // if config non-existent
        // copy default config
        try {
            fs.mkdirSync(pathConfigDir)
        } catch (e) {}
        fs.writeFileSync(pathConfig, fs.readFileSync(path.join(pathInitialization, 'config.json')))
        fs.mkdirSync(path.join(pathConfigDir, 'color_schemes'))
        fs.mkdirSync(path.join(pathConfigDir, 'databases'))
        fs.mkdirSync(path.join(pathConfigDir, 'templates'))
        config = JSON.parse(fs.readFileSync(pathConfig, 'utf8'))
        return {status: 'WELCOME'}
    }
    return {status: 'WELCOME_BACK'}
}

// DATABASE RELATED
function addDB(name, location) {
    // update the config
    config
        .dbs
        .push({name, location}) // add db to config
    config.last_accessed = location // make it default
    saveConfig()
}

function getDBList() {
    // also return the status
    return config
        .dbs
        .map((db) => db)
}

function getDefaultDBLocation() {
    return config.default_db
}

function setDefaultDB(location) {
    config.default_db = location
    saveConfig()
}

// Color Scheme Setup
function addColorScheme(scheme) {
    //fs.writeFileSync(path.join(pathColorSchemes, ))
}

function setColorScheme(scheme_file_name) {
    return fs.readFileSync(path.join(pathDefaultColorSchemes, defaultColorSchemes[0].file_name), 'utf8')
}

function getColorSchemeList() {
    // may be a bug because if webpack converts require(js_var)
    var all_schemes = []
    return all_schemes
        .push
        .apply(all_schemes, defaultColorSchemes)
        .push
        .apply(all_schemes, config.color_schemes)
}

function getColorScheme(scheme_file_name) { // returns actual css of color scheme
    // Check default color schemes first
    defaultColorSchemes.forEach((_scheme) => {
        if (_scheme.file_name === scheme_file_name) {
            return fs.readFileSync(path.join(pathDefaultColorSchemes, scheme_file_name), 'utf8')
        }
    })
    config
        .color_schemes
        .forEach((_scheme) => {
            if (_scheme.file_name === scheme_file_name) {
                return fs.readFileSync(path.join(pathColorSchemes, scheme_file_name), 'utf8')
            }
        })
    return fs.readFileSync(path.join(pathDefaultColorSchemes, defaultColorSchemes[0].file_name), 'utf8')
}

// Font Setup
function addCategory(name, icon, template) {}

// get Manifest
function getCategoryIconList() {
    return new Map(defaultTemplates.map((template) => [template.name, template.icon]))
}

//
function getCategoryList() {
    return defaultTemplates.concat(config.templates)
}

function getCategoryTemplate(template_name) { // NEED to ADD USER TEMPLATE
    var template_file_name = null
    for (var template of defaultTemplates) {
        if (template.name === template_name) {
            return JSON.parse(fs.readFileSync(path.join(pathDefaultTemplates, template.file_name), 'utf8'))
            break
        }
    }
    return null
}
/***********************
 ** private functions **
 ***********************/

function saveConfig() {
    if (config !== null) {
        fs.writeFileSync(pathConfig, JSON.stringify(config), 'utf8')
    } else {
        console.log('config corrupted')
    }
}