/**
 * Manages the GUI, and anything that does not directly change the database itself.
 */
import _ from 'lodash'
export default function guiReducer(state, action) {
    switch (action.type) {
        case 'ATTEMPT_UNLOCK':
            if (action.success) {
                return state.set('nav', action.manifest)
            }
            return state
        case 'NAV_ENTRY_CLICK':
            return state.merge({
                activePane: 'nav',
                activeNavTab: action.sNavTab, // s shorthand for selected
                activeNavTabType: action.sNavTabType,
                activeEntries: action.entries
            })
        case 'ENTRY_CLICK':
            return state.merge({
                activePane: 'entries',
                activeEntry: action.sEntryId,
                activeInfo: action.info
            })
        case 'CREATE_SECRET':
            return state.setIn(['nav', 'categories_count'], action.categories_count)
        case 'DELETE_SECRET':
            return state.setIn(['nav', 'categories_count'], action.categories_count)
        case 'UPDATE_META':
            return state
                .updateIn(['activeEntries', action.id, action.key], action.new_value)
                .updateIn(['activeInfo', action.key], action.new_value)
        case 'UPDATE_CUSTOM':
            action = action.params
            switch (action.operation) {
                case 'ADD_SECTION':
                    return state
                        .updateIn(['activeInfo', 'user_defined'], sections => sections.push(Map({ name: '', fields: List() })))
                case 'UPDATE_SECTION_TITLE':
                    return state
                        .updateIn(['activeInfo', 'user_defined', action.sec_idx, 'name'],
                        action.new_value)
                case 'UPDATE_FIELD':
                    return state
                        .setIn(['activeInfo', 'user_defined', action.sec_idx, 'fields', action.field_idx, action.content_idx],
                        action.new_value)
                case 'DELETE_FIELD':
                    var newState = state.deleteIn(['activeInfo', 'user_defined', action.sec_idx, 'fields', action.field_idx],
                        action.new_value)
                    if (newState.getIn(['activeInfo', 'user_defined', action.sec_idx, 'fields']).size === 0) {
                        newState.deleteIn(['activeInfo', 'user_defined', action.sec_idx])
                    }
                    return newState
                case 'ADD_FIELD':
                    return state
                        .updateIn(['activeInfo', 'user_defined', action.sec_idx], fields => fields.push(List(['', '', ''])))
            }
        default:
            return state
    }
}