/**
 * actions, action creators and thunks
 */

import config from '../utils/config'
import dataAPI from '../lib/dataAPI'
import cacheManager from '../lib/cacheManager'
import { debounce } from 'lodash'
import { Map, List, OrderedMap, fromJS } from 'immutable'

/// CONFIGURATION & DATABASE ACTIONS
// 0. SAVE_DB

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
    cacheManager.init(fromJS(dataAPI.readCache().cache))
    action.key = key
    // Create categories_count item
    action.manifest = Map({
        categories: OrderedMap(fromJS(config.getCategories())), // key is cateogyr and value is icon
        categories_count: cacheManager.getCategoryCounts(),
        tags: OrderedMap(config.appendTagColors(cacheManager.getTags()))// will be a orderedmap
    })
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
export const CREATE_SECRET = (category) => (dispatch, getState) => {
    // Switch to category view
    var secret = {
        "title": "",
        "attachment": false,
        "snippet": "",
        "tags": [],
        "favorite": false,
        "user_defined": [],
        "snapshots": {}
    }
    template = Object.assign(template, config.getTemplate(category))
    var { secret, message } = dataAPI.createSecret(template) // return secret with dates and id
    // Add to cache
    cacheManager.addSecret(secret)
    //return action
    dispatch({
        type: 'CREATE_SECRET',
        categories_count: cacheManager.getCategoryCounts(), // updates categories_count in case things have changed
    })
    dispatch(NAV_ENTRY_CLICK(secret.category, 'category'))
    dispatch(ENTRY_CLICK(secret.id))
}

export const TRASH_SECRET = (secret) => { // move to trash
    dataAPI.saveSecret
}

export const DELETE_SECRET = (id) => { // permenantly delete
    // dataAPi
    dataAPI.deleteSecret(id)
    dispath({
        type: 'DELETE_SECRET',
        id
    })
}

// 6. UPDATE_INFO
// Maybe implement two methods, one is update meta, another is update user_defined.

// UPDATE_META writes to both cache and file
// UPDATE_USER_DEFINED writes to only file and NOT cache
// in both cases, I need date_updated returned.
//  1. from dataAPI
//  2. directly written in action creators
export const UPDATE_META = (id, field, new_value) => (dispatch, getState) => {
    var action = {
        type: 'UPDATE_META',
        id,
        field,
        new_value
    }
    dispatch(action)
    var new_info = getState.getIn(['gui', 'activeInfo'])
    dispatch(SAVE_SECRET(new_info))
    cacheManager.updateSecret(new_info)
}

// updates user_defined custom data
export const UPDATE_CUSTOM = (id, operation, params) => (dispatch, getState) => {
    var action = {
        type: 'UPDATE_CUSTOM',
        operation,
        params
    }
    dispatch(action)
    dispatch(SAVE_SECRET(getState.getIn(['gui', 'activeInfo'])))
}

// SAVE_SECRET
export const SAVE_SECRET = (info) => {
    // cahnge immutable to mutable
    dataAPI.saveSecret(info)
    return { type: 'SAVE_SECRET' }
}

export const SAVE_DB = () => (dispatch, getState) => {

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
    sheet.innerHTML = css
    head.appendChild(sheet)
    dispatch({ type: 'COLOR_SCHEME_UPDATE' })
}