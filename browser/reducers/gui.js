/**
 * Manages the GUI, and anything that does not directly change the database itself.
 */

import { Map, List, fromJS } from 'immutable'

export default function guiReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_NAV':
            return state.set('nav', action.nav)
        case 'NAV_ENTRY_CLICK':
            // set activeIdxList
            var new_idx = action.entries.findIndex((entry) => entry.get('id') === state.getIn(['activeInfo', 'id']))
            if (new_idx === -1) {
                state = state
                    .set('activeInfo', null)
                    .set('activeIdxInList', null)
            } else {
                state = state.set('activeIdxInList', new_idx)
            }
            return state.merge({
                activePane: 'nav',
                activeNavTab: action.sNavTab, // s shorthand for selected
                activeNavTabType: action.sNavTabType,
                activeEntries: action.entries,
                currentTabEntries: action.entries
            })
        case 'ENTRY_CLICK':
            return state.merge({
                activePane: 'entries',
                activeEntry: action.sEntryId,
                activeInfo: action.info,
                activeIdxInList: action.idx
            })
        case 'CREATE_SECRET':
            return state.setIn(['nav', 'categories_count'], action.categories_count)
        case 'UPDATE_META':
            switch (action.operation) {
                // need to handle the sepcial case of tags since it is a List but only the tag updated or delested is reported
                case 'ADD_TAG':
                    var new_value = state.getIn(['activeInfo', 'tags']).push(action.params.new_value)
                    break
                case 'DELETE_TAG':
                    var new_value = state.getIn(['activeInfo', 'tags']).filter((tag) => tag !== action.params.new_value)
                    break
                default:
                    var new_value = action.params.new_value
            }
            // general case
            var idx_in_list = state.get('activeIdxInList')
            state = state.setIn(['activeInfo', action.params.key], new_value)
            state = state.setIn(['activeEntries', idx_in_list, action.params.key], new_value)
            return state
        case 'UPDATE_CUSTOM':
            var params = action.params
            switch (action.operation) {
                case 'ADD_SECTION':
                    return state
                        .updateIn(['activeInfo', 'user_defined'], sections => sections.push(fromJS({ title: '', fields: [['', '', 'text']] })))
                case 'UPDATE_SECTION_TITLE':
                    return state
                        .setIn(['activeInfo', 'user_defined', params.sec_idx, 'title'], params.new_value)
                case 'UPDATE_FIELD':
                    return state
                        .setIn(['activeInfo', 'user_defined', params.sec_idx, 'fields', params.field_idx, params.content_idx],
                        params.new_value)
                case 'DELETE_FIELD':
                    state = state.deleteIn(['activeInfo', 'user_defined', params.sec_idx, 'fields', params.field_idx])
                    if (state.getIn(['activeInfo', 'user_defined', params.sec_idx, 'fields']).size === 0) {
                        state = state.deleteIn(['activeInfo', 'user_defined', params.sec_idx])
                    }
                    return state
                case 'ADD_FIELD':
                    return state
                        .updateIn(['activeInfo', 'user_defined', params.sec_idx, 'fields'], fields => fields.push(List(['', '', ''])))
                default: throw 'invalid operation fired on UPDATE_CUSTOM'
            }
        case 'DELETE_SECRET':
            return state
                .set('activeInfo', null)
                .deleteIn(['activeEntries', state.get('activeIdxInList')])
        case 'SEARCH_COMPLETED':
            return state.set('activeEntries', action.search_results)
        case 'DEACTIVATE_SEARCH':
            return state.merge({
                activeEntries: action.entries
            })
        default:
            return state
    }
}