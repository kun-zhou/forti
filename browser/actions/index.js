/**
 * actions, action creators and thunks
 */

import config from '../utils/config'
import dataAPI from '../lib/dataAPI'
import cacheManager from '../lib/cacheManager'
import { debounce } from 'lodash'
import { Map, List, OrderedMap, fromJS } from 'immutable'
import { remote } from 'electron'
/// CONFIGURATION & DATABASE ACTIONS


/** 1. ATTEMPT_UNLOCK
 * STATUS, [db]
 * location: path to vault folder
 */
export const ATTEMPT_UNLOCK = (location, password) => (dispatch) => { //idx signals which database
    var action = { type: 'ATTEMPT_UNLOCK', location }
    var { success, message, error } = dataAPI.init(location, password)
    action.success = success
    if (success !== 0) {
        action.status = message
        console.log(error)
        dispatch(action)
    } else {
        var res_dc = dataAPI.readCache()
        if (res_dc.success !== 0) {
            throw res_dc.message + res_dc.error
        } else {
            cacheManager.init(fromJS(res_dc.cache))
        }

        // Create categories_count item
        config.setDefaultDB(location)
        dispatch(UPDATE_NAV())
        action.status = 'UNLOCKED'
        var win = remote.getCurrentWindow()
        dispatch(action)
    }
}

/** 2. CREATE_DB
 * STATUS
 */
export const CREATE_DB = (name, passwd) => {
    var action = { type: 'CREATE_DB' }
    var { success, message, location } = dataAPI.createVault(name, passwd)
    if (success !== 0) {
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
    var entries = cacheManager.getEntries(navTabType, navTab)
    dispatch({
        type: 'NAV_ENTRY_CLICK',
        sNavTab: navTab,
        sNavTabType: navTabType,
        entries: entries
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
    var guiState = getState().get('gui')
    var search_results = cacheManager.searchInTab(guiState.get('activeNavTabType'), guiState.get('activeNavTab'), keywords)
    dispatch({
        type: 'SEARCH_COMPLETED',
        search_results
    })
}

// 3. Search Entries
export const DEACTIVATE_SEARCH = () => (dispatch, getState) => {
    var gui = getState().get('gui')
    dispatch({
        type: 'DEACTIVATE_SEARCH',
        entries: cacheManager.getEntries(gui.get('activeNavTabType'), gui.get('activeNavTab'))
    })
}


// 4. Create Entry
export const CREATE_SECRET = (category) => (dispatch, getState) => {
    // Switch to category view
    var secret = {
        "id": dataAPI.getUID(),
        "title": "",
        "attachment": false,
        "snippet": "",
        "tags": [],
        "favorite": false,
        "user_defined": [],
        "snapshots": {}
    }
    secret = Object.assign(secret, config.getTemplate(category))
    var { secret, message } = dataAPI.createSecret(secret) // return secret with dates and id
    // Add to cache
    cacheManager.addSecret(fromJS(secret))
    //return action
    dispatch({
        type: 'CREATE_SECRET',
        categories_count: cacheManager.getCategoryCounts(), // updates categories_count in case things have changed
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
    dataAPI.deleteSecret(id)
    cacheManager.deleteSecret(id)
    dispatch({
        type: 'DELETE_SECRET'
    })
    dispatch(UPDATE_NAV())

    // change activeInfo
    var activeEntries = gui.get('activeEntries') // this is old state
    if (activeEntries.size > idx + 1) {
        var next_id = gui.getIn(['activeEntries', idx + 1, 'id']) // this is old idx
        dispatch(ENTRY_CLICK(next_id, idx))// not idx+1 as idx is gone
    } else if (activeEntries.size !== 1) {
        var next_id = gui.getIn(['activeEntries', idx - 1, 'id'])
        dispatch(ENTRY_CLICK(next_id, idx - 1))
    }
}

export const UPDATE_NAV = () => ({
    type: 'UPDATE_NAV',
    nav: Map({
        categories: OrderedMap(fromJS(config.getCategories())), // key is cateogyr and value is icon
        categories_count: cacheManager.getCategoryCounts(),
        tags: cacheManager.getTags()// will be a orderedmap
    })
})



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
        params
    }
    dispatch(action)
    cacheManager.updateSecret(getState().getIn(['gui', 'activeInfo', 'id']), action)
    dispatch(SAVE_SECRET())
    if (operation.includes('TAG')) {
        dispatch(UPDATE_NAV())
    }
}

// updates user_defined custom data
export const UPDATE_CUSTOM = (operation, params) => (dispatch, getState) => {
    var action = {
        type: 'UPDATE_CUSTOM',
        operation,
        params
    }
    dispatch(action)
    dispatch(SAVE_SECRET())
}

// SAVE_SECRET
export const SAVE_SECRET = () => (dispatch, getState) => {
    // change immutable to mutable
    dataAPI.saveSecret(getState().getIn(['gui', 'activeInfo']).toJS())
    return { type: 'SAVE_SECRET' }

}

export const CLOSE_DB = () => (dispatch, getState) => {
    dataAPI.closeVault(cacheManager.getCache().toJS())
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