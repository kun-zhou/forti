/**
 * actions, action creators and thunks
 */

import config from '../utils/config'
import dataAPI from '../lib/dataAPI'
import cacheManager from '../lib/cacheManager'
import { debounce } from 'lodash'
import { Map, List, OrderedMap, fromJS } from 'immutable'

/** 1. ATTEMPT_UNLOCK
 * location: path to vault folder
 */


export const ATTEMPT_UNLOCK = (location, password) => (dispatch) => { //idx signals which database
    var action = { type: 'ATTEMPT_UNLOCK', location }

    // START SIDE EFFECTS
    var { success, message, error } = dataAPI.init(location, password)
    // END

    action.success = success
    if (!success) {
        action.status = message
        console.log(error)
        dispatch(action)
    } else {
        var res_dc = dataAPI.readCache()
        if (!res_dc.success) {
            throw res_dc.message + res_dc.error
        }

        action.cache = fromJS(res_dc.cache)
        action.status = 'UNLOCKED'

        config.setDefaultDB(location)
        dispatch(action)
    }
}

/** 2. CREATE_DB
 * vault name and password
 */
export const CREATE_DB = (name, passwd) => {
    var action = { type: 'CREATE_DB' }
    var { success, message, location } = dataAPI.createVault(name, passwd)
    action.success = success
    if (!success) {
        action.status = message
        return action
    } else {
        config.addDB(name, location)
        action.status = 'SELECT_DB'
        return action
    }
}

// Responding to UI Changes
/** 1. NAV_ENTRY_CLICK
 * ACTION: activePane, activeNavTab, activeNavTabType, visibleEntries, allEntries
 * When a nav entry is clicked, the focus pane to switched to nav. 
 * And if active entry is not in the currnet nav tab, visibleInfo is set to null. 
 */
export const NAV_ENTRY_CLICK = (navTab, navTabType) => (dispatch, getState) => {
    dispatch({
        type: 'NAV_ENTRY_CLICK',
        sNavTab: navTab,
        sNavTabType: navTabType,
        entries: getEntries(navTabType, navTab, getState().get('cache'))
    })
}

// 2. ENTRY_CLICK
export const ENTRY_CLICK = (id, idx) => ({
    type: 'ENTRY_CLICK',
    sEntryId: id,
    idx,
    info: fromJS(dataAPI.readSecret(id).secret)
})

// 3. Search Entries
export const SEARCH_SECRETS = (keywords) => (dispatch, getState) => {
    dispatch({ type: 'SEARCH_LOADING' })
    var gui = getState().get('gui')
    var cache = getState().get('cache')
    var ids = getEntries(gui.get('activeNavTabType'), gui.get('activeNavTab'), cache)
    keywords = keywords.split(/\s+/)
    var results = []
    ids.forEach((id) => {
        var match = keywords.reduce((acc, keyword) => {
            var abstract = cache.getIn(['abstracts', id])
            return acc + Number(abstract.get('title').includes(keyword) || abstract.get('snippet').includes(keyword))
        }, 0)

        if (match === keywords.length) {
            results.push(id)
        }
    })
    dispatch({
        type: 'SEARCH_COMPLETED',
        search_results: results
    })
}

// 3. Search Entries
export const DEACTIVATE_SEARCH = () => (dispatch, getState) => {
    var gui = getState().get('gui')
    dispatch({
        type: 'DEACTIVATE_SEARCH',
        entries: getEntries(gui.get('activeNavTabType'), gui.get('activeNavTab'), getState().get('cache'))
    })
}


// 4. Create Entry
export const CREATE_SECRET = (category) => (dispatch, getState) => {
    // Switch to category view
    var template = {
        "id": dataAPI.getUID(),
        "title": "",
        "attachment": false,
        "snippet": "",
        "tags": [],
        "favorite": false,
        "user_defined": [],
        "snapshots": {}
    }

    // START SIDE EFFECTS
    template = Object.assign(template, config.getTemplate(category))
    var { secret, message } = dataAPI.createSecret(template) // return secret with dates and id
    // END

    dispatch({
        type: 'CREATE_SECRET',
        new_secret: fromJS(secret)
    })
    dispatch(NAV_ENTRY_CLICK(secret.category, 'category'))
    dispatch(ENTRY_CLICK(secret.id, 'others', 0))
}

export const TRASH_SECRET = (secret) => { // move to trash
}

export const DELETE_SECRET = () => (dispatch, getState) => { // permenantly delete
    var gui = getState().get('gui')
    var idx = gui.get('activeIdxInList')
    var id = gui.getIn(['activeInfo', 'id'])

    // START SIDE EFFECTS
    dataAPI.deleteSecret(id)
    // END

    dispatch({
        type: 'DELETE_SECRET',
        id
    })

    // change activeInfo
    /*
    var activeEntries = gui.get('activeEntries') // this is old state
    if (activeEntries.size > idx + 1) {
        var next_id = gui.getIn(['activeEntries', idx + 1, 'id']) // this is old idx
        dispatch(ENTRY_CLICK(next_id, idx))// not idx+1 as idx is gone
    } else if (activeEntries.size !== 1) {
        var next_id = gui.getIn(['activeEntries', idx - 1, 'id'])
        dispatch(ENTRY_CLICK(next_id, idx - 1))
    }
    */
}

// 6. UPDATE_INFO
// Maybe implement two methods, one is update meta, another is update user_defined.

// UPDATE_META writes to both cache and file
// UPDATE_USER_DEFINED writes to only file and NOT cache
// in both cases, I need date_updated returned.
//  1. from dataAPI
//  2. directly written in action creators
export const UPDATE_META = (operation, params) => (dispatch, getState) => {
    var action = {
        type: 'UPDATE_META',
        operation,
        params,
        id: getState().getIn(['gui', 'activeInfo', 'id'])
    }
    dispatch(action)

    // START SIDE EFFECTS
    dispatch(SAVE_SECRET())
    // END
}

// updates user_defined custom data
export const UPDATE_CUSTOM = (operation, params) => (dispatch, getState) => {
    var action = {
        type: 'UPDATE_CUSTOM',
        operation,
        params
    }
    dispatch(action)

    // START SIDE EFFECTS
    dispatch(SAVE_SECRET())
    // END
}

// SAVE_SECRET
export const SAVE_SECRET = () => (dispatch, getState) => {
    // change immutable to mutable
    dataAPI.saveSecret(getState().getIn(['gui', 'activeInfo']).toJS())
    return { type: 'SAVE_SECRET' }
}

export const CLOSE_DB = () => (dispatch, getState) => {
    dataAPI.closeVault(getState.get('cache').toJS())
    dispatch({ type: 'DB_CLOSED' })
}

// COLOR SCHEME
export const SET_COLOR_SCHEME = (scheme) => (dispatch) => {
    var css = config.getColorScheme(scheme)
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

export const UPDATE_CONFIG = () => {
    return {
        type: 'UPDATE_CONFIG',
        categories: config.getCategories(),
        listOfDB: config.getDBList(),
        lastAccessed: config.getDefaultDBLocation()
    }
}

function getEntries(type, name, cache) {
    switch (type) {
        case 'all':
            return cache.get('all')
        case 'favorite':
            return cache.get('favorites')
        case 'category':
            return cache.getIn(['categories', name])
        case 'tag':
            return cache.getIn(['tags', name])
        case 'trash':
            return cache.get('trash')
        default:
            return null
    }
}