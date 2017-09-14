
/*
 * This module maintains the state of the application
 */
import { fromJS } from 'immutable'
export default {
    // Initializer
    initialize: initialize,
    // Navigation Getter
    getNav: getNav,
    // Naviagation Setter
    addTag: addTag,
    delTag: delTag,
    addCategory: addCategory,
    delCategory: delCategory,
    // Entries Getter
    getMix: getMix,
    searchEntries: searchEntries,
    // Entry Getter
    getEntry: getInfo,
    // Entry Setter
    addEmptyEntry: addEmptyEntry,
    delEntry: delEntry,
    addField: addField,
    editField: editField,
    delField: delField,

    addSection: addSection,
    editSection: editSection,
    delSection: delSection,

    markFav: markFav,
    unmarkFav: unmarkFav,
    addTagToEntry: addTagToEntry,
    delTagFromEntry: delTagFromEntry,

    getDB: getDB
}
/*
 * Whenever an entry is added or an entry is edited, it is moved to the last position of categories_keys and tags_keys
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const lockit_crypto = require('./lockit_crypto')

var db = null

var state = {
    previousBumped: null
}
// Initializer
/**
 * Initialize the database store
 * @param {object} database - Complete decrypted database.
 */
function initialize(database) {// pathDB, masterpassword
    db = database
}

// 1.1 Retrieve Info
// 1.1.1 Retrieve Navigation Meta Info
/**
 * Retrieve navigation informaton
 * @param {number} id - The id of the entry.
 */
function getNav() {
    return fromJS({
        categories: getCategories(),
        tags: getTags()
    })
}
function getCategories() {
    return { categories_order: db.categories_order, categories_icon: db.categories_icon }
}

function getTags() {
    return { tags_order: db.tags_order, tags_color: db.tags_color }
}


// 1.1.2 Retrieve Entries
/**
 * Retrieve entries of a specific category or tag
 * @param {string} tab - The name of the category or tag, or favorites or all.
 * @param {string} type - category, tag, favorites, or all.
 * @return {object} An object structured as { ids: [], contents: {} } where id is a list of ids of the entries and contents is an object containing the abstracts of entries mapped by these ids (id is the key in contents)
 */
function getMix(tab, type) {
    switch (type) {
        case 'tag':
            var response = getTag(tab); break;
        case 'category':
            var response = getCategory(tab); break;
        case 'favorites':
            var response = getFavorites(); break;
        case 'all':
            var response = getAll(); break;
        case 'trash':
            var response = getTrash(); break;
    }
    return { ids: fromJS(response.ids), contents: fromJS(response.contents) }
}

/**
 * Retrieve entries of matching keywords
 * @param {array} ids - A list of entries by id to search from
 * @param {string} keywords - keywords
 * @return {object} A list of matching entries by id
 */
function searchEntries(ids, keywords) {
    keywords = keywords.split(' ')
    var matched_ids = []
    for (let id of ids) {
        var match = keywords.reduce(
            (acc, keyword) => {
                return acc + Number(db.entries[id].title.includes(keyword) || JSON.stringify(db.entries[id].user_defined).includes(keyword))
            }, 0
        )
        if (match === keywords.length) {
            matched_ids.push(id)
        }
    }
    return matched_ids
}

// 1.1.3 Retrieve Info
/**
 * Retrieve complete info of an entry
 * @param {number} id - The id of the entry.
 * @return {object} complete information of an entry
 */
function getInfo(id) {
    if (db.entries[id] === undefined) {
        return undefined
    }
    return fromJS(db.entries[id])
}

// 1.2 Set Info
// 1.2.1 Add/Delete navigation tabs
/**
 * Add new tag to the database
 * @param {string} tag - name of the tag.
 * @param {string} color - hex value of tag color
 * @return {object} success information [0 success, 1 failure]
 */
function addTag(tag, color) {
    try {
        // Check color validness
        if (!/^#[0-9A-F]{6}$/i.test(color)) {
            return { success: 1, message: 'Tag color not valid!' }
        }
        // Check tag existence
        if (db.tags_order.includes(tag)) return { success: 1, message: 'Tag already exist!' }
        // Actual processing
        db.tags_order.push(tag)
        db.tags_color[tag] = color
        db.tags_keys[tag] = []
        return { success: 0, message: 'Success!' }
    }
    catch (e) {
        return { success: 1, message: e.message }
    }
}

/**
 * Delete tag from the database
 * @param {string} tag - name of the tag.
 * @return {object} success information [0 success, 1 failure]
 */
function delTag(tag) {
    // Actual processing
    db.tags_order.splice(db.tags_order.indexOf(tag), 1)
    delete db.tags_color[tag]
    delete db.tags_keys[tag]
    return { success: 0, message: 'Success!' }
}

function addCategory(category, icon) {
    if (true) { // Check icon validness
        db.categories_order.push(category)
        db.categories_icon[category] = icon
        db.categories_keys[category] = []
        return { success: 0, message: 'Success!' }
    } else {
        return { success: 1, message: 'Icon invalid' }
    }
}

function delCategory(category, icon) {
    db.categories_order.splice(db.categories_order.indexOf(category), 1)
    delete db.categories_icon[category]
    delete db.categories_keys[category]
    return { success: 0, message: 'Success!' }
}

// 1.2.2 Edit Entry
/**
 * Add new tag to an existing entry
 * @param {string} id - id of the entry the tag is being added to.
 * @param {string} tag - name of the exisiting tag that is to be added to the entry
 * @return {object} success information [0 success, 1 failure]
 */
function addTagToEntry(id, tag) { // add a tag to an entry and update db.tag object
    var newTag = false
    if (db.entries[id].tags.includes(tag)) return { success: 1 }
    if (!db.tags_order.includes(tag)) { // Check if tag exist, add if not
        var response = addTag(tag, '#CE8383')
        if (response.success === 1) return response
        newTag = true
        
    }
    db.entries[id].tags.push(tag)
    db.tags_keys[tag].push(id)
    console.log(newTag)
    return { success: 0, message: 'Success!', newTag }
}

/**
 * Delete an existing tag from an existing entry
 * @param {string} id - id of the entry the tag is being deleted from.
 * @param {string} tag - name of the exisiting tag that is to be deleted to the entry
 * @return {object} success information [0 success, 1 failure]
 */
function delTagFromEntry(id, tag) { // Add a tag to an entry and update db.tag object
    if (!db.tags_order.includes(tag)) { // Check if tag exist
        return { success: 1, message: 'Tag does not exist.' }
    } else {
        var entry_tags = db.entries[id].tags
        entry_tags.splice(entry_tags.indexOf(tag), 1)
        var keys = db.tags_keys[tag]
        keys.splice(keys.indexOf(id), 1)
        // Delete tag if no more entries of it exist.
        var tagStillExist = true
        if (db.tags_keys[tag].length === 0) {
            delTag(tag)
            tagStillExist = false
        }
        return { success: 0, message: 'Success!', tagStillExist }
    }
}

/**
 * Add an empty field in the entry with type specified
 * @param {string} id - id of the entry.
 * @param {string} section - section name of the entry
 * @param {string} type - type can be [text, passcode, url, note]
 * @return {object} success information [0 success, 1 failure]
 */
function addField(id, section, type) { //TODO Update entries to top
    bumpEntry(id)
    var entry = db.entries[id]
    if (!entry['sections_order'].includes(section)) { // if section name does not exist
        return { success: 1, message: 'Section name does not exist.' }
    }
    do {
        var field_id = crypto.randomBytes(6).toString('base64')
    } while (Object.keys(entry['user_defined']).includes(id))
    entry['sections'][section].push(field_id)
    entry['user_defined'][field_id] = ['', '', type]
    return { success: 0, message: 'Success!' }
}

/**
 * Edit an existing field in the entry
 * @param {string} id - id of the entry.
 * @param {string} field_id - id of the field. (Title field id is defined to be '0')
 * @param {object} field_property - name, or content or type
 * @param {object} value - new value
 * @return {object} success information [0 success, 1 failure]
 */
function editField(id, field_id, field_property, value) {
    bumpEntry(id)
    var entry = db.entries[id]
    if (field_id === '0') { // handle title edit
        entry['title'] = value
        return { success: 0, message: 'Success!' }
    }
    switch (field_property) {
        case 'name':
            entry['user_defined'][field_id][0] = value; break
        case 'content':
            entry['user_defined'][field_id][1] = value; break
        case 'type':
            entry['user_defined'][field_id][2] = value; break
        default:
            return { success: 1, message: 'Field property does not exist!' }
    }
    return { success: 0, message: 'Success!' }
}


/**
 * Delete an existing field in the entry
 * @param {string} id - id of the entry the tag is being added to.
 * @param {string} field_id - id of the field. (Title field id is defined to be '0')
 * @param {string} section_name - name of the section the field belongs to.
 * @return {object} success information [0 success, 1 failure]
 */
function delField(id, field_id, section_name) {
    var entry = db.entries[id]
    delete entry['user_defined']['field_id']
    var section = entry.sections[section_name]
    section.splice(section.indexOf(field_id), 1)
    // Del from main db
    delete db.entries[id]
}

/**
 * Delete an existing entry from database
 * @param {string} id - id of the entry the tag is being added to.
 * @return {object} success information [0 success, 1 failure]
 */

function delEntry(id) {
    var entry = db.entries[id]
    // Del from tag list
    entry.tags.forEach(
        (tag) => {
            var keys = db.tags_keys[tag]
            keys.splice(keys.indexOf(id), 1)
        }
    )
    // Del from category list
    var cat_keys = db.categories_keys[entry.category]
    cat_keys.splice(cat_keys.indexOf(id), 1)
    // Del from favorites
    if (entry.favorite) {
        db.favorites.splice(db.favorites.indexOf(id), 1)
    }
    // Del from all_keys
    db.all_keys.splice(db.all_keys.indexOf(id), 1)
    // Add to deleted keys
    db.trash_keys.push(id)
}

/**
 * Add an new section to an entry
 * @param {string} id - id of the entry.
 * @param {string} section - section name
 * @return {object} success information [0 success, 1 failure]
 */
function addSection(id, section) {
    bumpEntry(id)
    var entry = db.entries[id]
    if (entry['sections_order'].includes(section)) { // if section name does not exist
        return { success: 1, message: 'Section name already exist.' }
    }
    entry['sections_order'].push(section)
    entry['sections'][section] = []
    return { success: 0 }
}

/**
 * Edit a section name of an entry
 * @param {string} id - id of the entry.
 * @param {string} section - previous section name
 * @param {string} new_section - new section name
 * @return {object} success information [0 success, 1 failure]
 */
function editSection(id, section, new_section) {
    bumpEntry(id)
    var entry = db.entries[id]
    if (!entry['sections_order'].includes(section)) { // if section name does not exist
        return { success: 1, message: 'Section name does not exist.' }
    }
    // Rename in section order array
    entry['sections_order'][entry['sections_order'].indexOf(section)] = new_section
    // Rename in sections object
    entry['sections'][new_section] = entry['sections'][section]
    delete entry['sections'][section]
    return { success: 0 }
}

/** STILL NEEDS WORK AND THOUGHTS: SHOULD ALL ENTRIES IN A SECTION BE DELETED WHEN THE SECTION NAME IS DELTED.
 * Delete an existing section of an entry
 * @param {string} id - id of the entry.
 * @param {string} section - section name
 * @return {object} success information [0 success, 1 failure]
 */
function delSection(id, section) {
    bumpEntry(id)
    var entry = db.entries[id]
    if (!entry['sections_order'].includes(section)) { // if section name does not exist
        return { success: 1, message: 'Section name does not exist.' }
    }
    // Deleting from Obejct and Array
    delete entry['sections'][section]
    entry['sections_order'].splice(entry['sections_order'].indexOf(section), 1)
    return { success: 0 }
}

function markFav(id) {
    db.favorites.push(id)
    db.entries[id]['favorite'] = true;
}

function unmarkFav(id) {
    db.favorites.splice(db.favorites.indexOf(id), 1)
    db.entries[id]['favorite'] = false;
}


// 1.2.3 Add New Entry
/** STILL NEEDS WORK AND THOUGHTS: SHOULD ALL ENTRIES IN A SECTION BE DELETED WHEN THE SECTION NAME IS DELTED.
 * Delete an existing section of an entry
 * @param {string} category - category of the entry.
 * @param {string} template - actual template
 * {
    'name': 'Login',
    'sections': ['Basic Info'],
    'fields': {
        'Basic Info': {
            'fields': ['Account', 'Password', 'Website', 'Note'],
            'type': ['text', 'passcode', 'url', 'note']
        }
    }
}
 * @return {object} success information [0 success, 1 failure] and abstract entry {contents and id}
 */
function addEmptyEntry(category, template) {
    // add category if it does not exist
    var newCat = false
    if (!db.categories_order.includes(category)) {
        db.categories_order.push(category)
        db.categories_keys[category] = []
        newCat = true
    }
    // Figure out a unique ID
    // Generate unique id
    do {
        var id = crypto.randomBytes(11).toString('base64')
    } while (Object.keys(db.entries).includes(id))
    // Initializing a blank item
    var entry = {}
    entry.title = 'Untitled..'
    entry.tags = []
    entry.time_created = (new Date()).getTime()
    entry.time_modified = (new Date()).getTime()
    entry.id = id
    entry.category = category
    // Copying from template
    entry.sections = template.sections
    entry.sections_order = template.sections_order
    entry.user_defined = template.user_defined
    // Add to database
    db.categories_keys[category].push(id)
    db.all_keys.push(id)
    db.entries[id] = entry
    return {
        success: 0,
        abstract: {
            id: entry.id,
            title: entry.title,
            category: entry.category,
            tags: []
        },
        newCat
    }
}

// 1.3 Backup functionalities

/** STILL NEEDS WORK AND THOUGHTS
 * Backup a snapshot of the particular entry
 * @param {string} id - id of the entry.
 * @return {object} success information [0 success, 1 failure]
 */


// 2 Lower level utilties (no actionable by outside stuff)
function getFavorites() { //return an Array of favorite items
    return appendAbstract(db.favorites)
}

function getAll(sort) {
    return appendAbstract(db.all_keys)
}

function getTrash() {
    return appendAbstract(db.trash_keys)
}

function getCategory(category, sort) {
    var ids = fetchCategory(category)
    return appendAbstract(ids)
}

function getTag(tag) {
    var ids = fetchTag(tag)
    return appendAbstract(ids)
}


function appendAbstract(ids) {
    var response = { ids: [], contents: {} }
    for (let idx = (ids.length - 1); idx > -1; idx--) {
        let entry = db.entries[ids[idx]]
        response['ids'].push(entry.id)
        response['contents'][entry.id] = {
            id: entry.id,
            title: entry.title,
            category: entry.category,
            tags: entry.tags
        }
    }
    return response
}
// Fetch are lower level functions
function fetchTag(tag, sort) { // return an array of ids of entries from the specifified {{tag}}
    return db.tags_keys[tag]
}

function fetchCategory(category, sort) {
    return db.categories_keys[category]
}

function bumpEntry(id) {
    if (state.previousBumped === id) {
        return
    }
    // Move entry to the last of corresponding tag list
    var entry = db.entries[id]
    entry.tags.forEach(
        (tag) => {
            var keys = db.tags_keys[tag]
            keys.splice(keys.indexOf(id), 1)
            db.tags_keys[tag].push(id)
        }
    )
    // Move entry to the last of corresponding category list
    db.categories_keys[entry.category].splice(db.categories_keys[entry.category].indexOf(id), 1)
    db.categories_keys[entry.category].push(id)
    // Move entry to last of favorites
    if (entry.favorite) {
        db.favorites.splice(db.favorites.indexOf(id), 1)
        db.favorites.push(id)
    }
    // Move to Last of all_keys
    db.all_keys.splice(db.all_keys.indexOf(id), 1)
    db.all_keys.push(id)
    state.previousBumped = id
}

function getDB() {
    return db
}

/*
function addAttachment(url) {
    // add url
    // return address of the file (dataset id + data id)
}

function delAttachment() {

}

function encryptEntry() {

}
*/