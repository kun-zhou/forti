/**
 * actions, action creators and thunks
 */

import config from '../utils/config'
import dataAPI from '../lib/dataAPI'
import cacheManager from '../lib/cacheManager'
import { genUniqueId, getKeysLoc } from './helper'
import { debounce } from 'lodash'

/// CONFIGURATION & DATABASE ACTIONS
// 0. SAVE_DB
export const SAVE_DB = () => (dispatch, getState) => {
    dispatch({ status: 'DB_BEING_SAVED' })
    var state = getState()
    config.saveDB(state.get('db').toJS(), state.getIn(['status', 'activeDBLoc']), state.getIn(['status', 'password']))
    dispatch({ status: 'DB_SAVED' })
}

/** 1. ATTEMPT_UNLOCK
 * STATUS, [db]
 * location: path to vault folder
 */
export const ATTEMPT_UNLOCK = (location, password) => { //idx signals which database
    var action = { type: 'ATTEMPT_UNLOCK', location, password }
    var { success, message, key } = dataAPI.init(location, password)
    action.success = success
    if (!success) {
        action.status = message
        return action
    }
    var { cache } = dataAPI.readCache()
    cacheManager.init(cache)
    action.key = key
    action.manifest = {
        categories: new Map(cache.manifest.categories),
        tags: new Map(cache.manifest.tags)
    }
    action.status = 'UNLOCKED'
    return action
}

/** 2. CREATE_DB
 * STATUS
 */
export const CREATE_DB = (name, passwd) => {
    var action = { type: 'CREATE_DB' }
    var { location } = dataAPI.createDemoVault(name, passwd)
    config.addDB(name, location)
    return action
}

// Responding to UI Changes
/** 1. NAV_ENTRY_CLICK
 * ACTION: activePane, activeNavTab, activeNavTabType, visibleEntries, allEntries
 * When a nav entry is clicked, the focus pane to switched to nav. 
 * And if active entry is not in the currnet nav tab, visibleInfo is set to null. 
 */
export const NAV_ENTRY_CLICK = (navTab, navTabType) => (dispatch, getState) => {
    var entries = cacheManager.getEntries(navTabType, navTab)
    dispatch({
        type: 'NAV_ENTRY_CLICK',
        sNavTab: navTab,
        sNavTabType: navTabType,
        entries: entries
    })
}

// 2. ENTRY_CLICK
export const ENTRY_CLICK = (id) => ({
    type: 'ENTRY_CLICK',
    sEntryId: id,
    info: dataAPI.readSecret(id).secret
})

// 3. Search Entries
export const SEARCH_ENTRIES = (ids, keywords) => (dispatch, getState) => {
    dispatch({ type: 'SEARCH_ENTRIES_LOADING' })
    var guiState = getState().get('gui')
    var dbState = getState().get('db')
    var navTabType = guiState.get('activeNavTabType')
    var navTab = guiState.get('activeNavTab')

    var location = getKeysLoc(navTabType, navTab)
    var releventIds = getState().getIn(location)
    var matchedEntries = []

    var keywords_s = keywords.split(' ')
    releventIds.forEach(
        (id) => {
            var match = keywords_s.reduce(
                (acc, keyword) => {
                    return acc + Number(dbState.getIn(['entries', id, 'title']).includes(keyword) || JSON.stringify(dbState.getIn(['entries', id, 'user_defined'])).includes(keyword))
                }, 0
            )

            if (match === keywords_s.length) {
                matchedEntries.push(id)
            }
        }
    )
    dispatch({
        type: 'SEARCH_ENTRIES_DONE',
        entries: List(matchedEntries),
    })
}

// 4. Create Entry
export const CREATE_ENTRY = (category) => (dispatch, getState) => {
    // Switch to category view
    var location = getKeysLoc('categories', category)
    var entries = getState().getIn(location)
    var existingIds = getState().getIn(['db', 'entries']).keySeq().toArray()
    var action = {
        type: 'CREATE_ENTRY',
        category: category,
        newId: genUniqueId(9, existingIds),
        template: config.getTemplate(category),
        currentTime: (new Date()).getTime(),
        entries
    }
    dispatch(action)
}

export const DELETE_ENTRY = (id) => ({
    type: 'DELETE_ENTRY',
    id
})
// 6. UPDATE_INFO
export const UPDATE_INFO = (info) => (dispatch, getState) => {
    // 1. write to file
    dataAPI.saveSecret(info)
    // 2. update cache
    cacheManager.updateSecret(info)
    var action = {
        type: 'UPDATE_INFO',
    }
    dispatch(action)
}

// 5. Edit Title
export const EDIT_TITLE = (id, value) => (dispatch, getState) => {
    var action = {
        type: 'EDIT_TITLE',
        id: getState().getIn(['gui', 'activeEntry']),
        value: value
    }
    dispatch(action)
}

export const EDIT_SECTION_HEADER = (id, idx, new_header) => ({
    type: 'EDIT_SECTION_HEADER',
    id,
    idx,
    new_header
})


// 6. Edit field
export const EDIT_FIELD = (id, field_id, property, value) => ({
    type: 'EDIT_FIELD',
    id,
    field_id,
    property,
    value
})

export const DEL_FIELD = (id, idx, field_id) => ({
    type: 'DEL_FIELD',
    id,
    idx,
    field_id
})

export const ADD_FIELD = (id, idx, type) => (dispatch, getState) => {
    var action = {
        type: 'ADD_FIELD',
        id,
        idx,
        field_type: type,
        field_id: genUniqueId(6, getState().getIn(['db', 'entries', id, 'user_defined']).keySeq().toArray())
    }
    dispatch(action)
}

export const ADD_SECTION = (id, idx) => (dispatch, getState) => {
    // idx is the section index the action is dispacthed from
    dispatch({
        type: 'ADD_SECTION',
        id
    })
    dispatch(ADD_FIELD(id, idx + 1, 'text')) // idx+1 represents the new section
}

// 1. ADD/DEL TO/FROM FAV
export const MARK_FAV = (entry_id) => ({
    type: 'MARK_FAV',
    id: entry_id
})

export const UNMARK_FAV = (entry_id) => ({
    type: 'UNMARK_FAV',
    id: entry_id
})

// 2. ADD/DEL TAG
export const ADD_TAG = (id, tag) => (dispatch, getState) => {
    var action = {
        type: 'ADD_TAG',
        id: getState().getIn(['gui', 'activeEntry']),
        tag,
        color: '#d0bfae'
    }
    dispatch(action)
}


export const DEL_TAG = (tag) => (dispatch, getState) => {
    var action = {
        type: 'DEL_TAG',
        id: getState().getIn(['gui', 'activeEntry']),
        tag,
    }
    dispatch(action)
}

export const DELETE_TAG_FROM_NAV = (tag) => ({
    type: 'DELETE_TAG_FROM_NAV',
    tag
})

export const CHANGE_TAG_COLOR = (tag, color) => ({
    type: 'CHANGE_TAG_COLOR',
    tag,
    color
})

// SAVE_SECRET
export const SAVE_SECRET = (info) => {
    dataAPI.saveSecret(info)
    return { type: 'SAVE_SECRET' }
}

// COLOR SCHEME
export const SET_COLOR_SCHEME = (scheme) => (dispatch) => {
    var css = config.getColorScheme(scheme)
    css = css ? css : config.getColorScheme('Red Graphite')
    var head = document.head
    if (!document.getElementById('color-scheme')) { // if color scheme is not in place
        var sheet = document.createElement('style')
        sheet.type = 'text/css';
        sheet.id = 'color-scheme'
    }
    console.log('css', css)
    sheet.innerHTML = css
    head.appendChild(sheet)
    dispatch({ type: 'COLOR_SCHEME_UPDATE' })
}