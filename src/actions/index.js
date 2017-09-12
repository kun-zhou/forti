/**
 * actions, action creators and thunks
 */

import config from '../backend/config'
import { Map, List, fromJS } from 'immutable'

import { genUniqueId, getKeysLoc } from './helper'

/// CONFIGURATION & DATABASE ACTIONS
// 0. SAVE_DB
export const SAVE_DB = () => (dispatch, getState) => {
    config.saveDB(getState().get('db').toJS())
    dispatch({status: 'DB_SAVED'})
}

/** 1. ATTEMPT_UNLOCK
 * STATUS, [db]
 */
export const ATTEMPT_UNLOCK = (password) => {
    var action = { type: 'ATTEMPT_UNLOCK' }
    var response = config.retrieveDB(password)
    if (response.success !== 0) {
        action['status'] = 'PASSWORD_ERROR'
    } else {
        action['status'] = 'UNLOCKED'
        action['db'] = response.payload
    }
    return action
}

/** 2. CREATE_DB
 * STATUS
 */
export const CREATE_DB = (password) => {
    config.createDB('default', password)
    return { type: 'CREATE_DB', status: 'ENCRYPTED_DB_LOCATED' }
}

// Responding to UI Changes
/** 1. NAV_ENTRY_CLICK
 * ACTION: activePane, activeNavTab, activeNavTabType, visibleEntries, allEntries
 * When a nav entry is clicked, the focus pane to switched to nav. 
 * And if active entry is not in the currnet nav tab, visibleInfo is set to null. 
 */
export const NAV_ENTRY_CLICK = (navTab, navTabType) => (dispatch, getState) => {
    var location = getKeysLoc(navTabType, navTab)
    var entries = getState().getIn(location)
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
    sEntryId: id
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
                console.log(matchedEntries)
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


// 5. Edit Title
export const EDIT_TITLE = (id, value) => (dispatch, getState) => {
    var action = {
        type: 'EDIT_TITLE',
        id: getState().getIn(['gui', 'activeEntry']),
        value: value
    }
    dispatch(action)
}

export const EDIT_SECTION_HEADER = (id, section_header, new_header) => ({
        type: 'EDIT_SECTION_HEADER',
        id: id,
        section_header,
        new_header
})


// 6. Edit field
export const EDIT_FIELD = (id, field_id, property, value) => (dispatch, getState) => {
    // property is name, content, or type
    var action = {
        type: 'EDIT_FIELD',
        id: getState().getIn(['gui', 'activeEntry']),
        field_id: field_id,
        property,
        value
    }
    dispatch(action)
}

export const ADD_FIELD = (id, section, type) => (dispatch, getState) => {
    var id = getState().getIn(['gui', 'activeEntry'])
    var action = {
        type: 'ADD_FIELD',
        id,
        section,
        field_type: type,
        field_id: genUniqueId(6, getState().getIn(['db', 'entries', id, 'user_defined']).keySeq().toArray())
    }
    dispatch(action)
}

// 1. ADD/DEL TO/FROM FAV
export const MARK_FAV = (entry_id) => (dispatch, getState) => {
    var action = {
        type: 'MARK_FAV',
        id: getState().getIn(['gui', 'activeEntry'])
    }
    dispatch(action)
}

export const UNMARK_FAV = (entry_id) => (dispatch, getState) => {
    var action = {
        type: 'UNMARK_FAV',
        id: getState().getIn(['gui', 'activeEntry'])
    }
    dispatch(action)
}

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

// MODAL OPERATIONS

export const DISPLAY_MODAL = (modal) => ({
    type: 'DISPLAY_MODAL',
    modal
})

export const MODAL_STATUS_UPDATE = (status) => ({
    type: 'MODAL_STATUS_UPDATE',
    status
})

export const CLOSE_MODAL = (status) => ({
    type: 'CLOSE_MODAL'
})