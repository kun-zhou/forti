/**
 * Manages the GUI, and anything that does not directly change the database itself.
 */

import { Map, List, fromJS } from 'immutable'

export default function guiReducer(gui, action) {
    switch (action.type) {
        case 'NAV_ENTRY_CLICK':
            return gui.merge({
                activePane: 'nav',
                activeNavTab: action.sNavTab, // s shorthand for selected
                activeNavTabType: action.sNavTabType,
                activeEntries: action.entries,
                activeInfo: null
            })
        case 'ENTRY_CLICK':
            return gui.merge({
                activePane: 'entries',
                activeInfo: action.info,
                activeIdxInList: action.idx
            })
        case 'UPDATE_META':
            switch (action.operation) {
                // need to handle the sepcial case of tags since it is a List but only the tag updated or delested is reported
                case 'ADD_TAG':
                    var new_value = gui.getIn(['activeInfo', 'tags']).push(action.params.new_value)
                    break
                case 'DELETE_TAG':
                    var new_value = gui.getIn(['activeInfo', 'tags']).filter((tag) => tag !== action.params.new_value)
                    break
                default:
                    var new_value = action.params.new_value
            }
            gui = gui.setIn(['activeInfo', action.params.key], new_value)
            return gui
        case 'UPDATE_CUSTOM':
            var params = action.params
            switch (action.operation) {
                case 'ADD_SECTION':
                    return gui
                        .updateIn(['activeInfo', 'user_defined'], sections => sections.push(fromJS({ title: '', fields: [['', '', 'text']] })))
                case 'UPDATE_SECTION_TITLE':
                    return gui
                        .setIn(['activeInfo', 'user_defined', params.sec_idx, 'title'], params.new_value)
                case 'UPDATE_FIELD':
                    return gui
                        .setIn(['activeInfo', 'user_defined', params.sec_idx, 'fields', params.field_idx, params.content_idx],
                        params.new_value)
                case 'DELETE_FIELD':
                    gui = gui.deleteIn(['activeInfo', 'user_defined', params.sec_idx, 'fields', params.field_idx])
                    if (gui.getIn(['activeInfo', 'user_defined', params.sec_idx, 'fields']).size === 0) {
                        gui = gui.deleteIn(['activeInfo', 'user_defined', params.sec_idx])
                    }
                    return gui
                case 'ADD_FIELD':
                    return gui
                        .updateIn(['activeInfo', 'user_defined', params.sec_idx, 'fields'], fields => fields.push(List(['', '', ''])))
                default: throw 'invalid operation fired on UPDATE_CUSTOM'
            }
        case 'DELETE_SECRET':
            return gui.set('activeInfo', null).deleteIn(['activeEntries', gui.get('activeIdxInList')])
        case 'SEARCH_COMPLETED':
            return gui.set('activeEntries', action.search_results)
        case 'DEACTIVATE_SEARCH':
            return gui.merge({
                activeEntries: action.entries
            })
        default:
            return gui
    }
}