/**
 * Manages the GUI, and anything that does not directly change the database itself.
 */
import { Map, List } from 'immutable'
export default function guiReducer(state, action) {
    //console.log('gui', state.toJS(), action)
    switch (action.type) {
        // UPDATE STATUS
        case 'ATTEMPT_UNLOCK':
            return state.set('status', action.status)
        // UPDATE STATUS
        case 'CREATE_DB':
            return state.set('status', action.status)
        // UPDATE active navTab
        case 'NAV_ENTRY_CLICK':
            var newState = state
            if (!action.entries.includes(state.get('activeEntry'))) {
                newState = newState.set('activeEntry', null)
            }
            return newState
                .set('activePane', 'nav')
                .set('activeNavTab', action.sNavTab) // s shorthand for selected
                .set('activeNavTabType', action.sNavTabType)
                .set('activeEntries', action.entries)
        case 'ENTRY_CLICK':
            return state
                .set('activePane', 'entries')
                .set('activeEntry', action.sEntryId)
        case 'SEARCH_ENTRIES_LOADING':
            return state.set('activeEntries', 'loading')
                .set('activePane', 'search')
        case 'SEARCH_ENTRIES_DONE':
            return state.set('activeEntries', action.entries)
        case 'CREATE_ENTRY':
            return state
                .set('activePane', 'entries')
                .set('activeNavTabType', 'categories')
                .set('activeNavTab', action.category)
                .set('activeEntries', action.entries === undefined ? List([action.newId]) : action.entries.unshift(action.newId))
                .set('activeEntry', action.newId)
        case 'DELETE_ENTRY':
            var nextActiveEntry
            return state
                .update('activeEntries', (list) => {
                    var current_idx = list.indexOf(action.id)
                    nextActiveEntry = list.get(current_idx + 1)
                    return list.splice(current_idx, 1)
                })
                .set('activeEntry', nextActiveEntry)
                .set('activePane', nextActiveEntry ? 'entries' : 'nav')
        case 'DISPLAY_MODAL':
            return state.set('modal', action.modal)
        case 'MODAL_STATUS_UPDATE':
            return state
                .set('modalResponse', action.response)
        case 'CLOSE_MODAL':
            return state
                .set('modal', null)
                .set('modalResponse', null)
        default:
            return state
    }
}