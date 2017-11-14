/**
 * Manages the GUI, and anything that does not directly change the database itself.
 */

import { Map, List, fromJS } from 'immutable'

function getAbstractLoc(state) { //returns fav_loc and others_loc, -1 if not in there, otherwise return location
    var id = state.getIn(['activeInfo', 'id'])
    return {
        fav_loc: state.getIn(['activeEntries', 'favorites']).findIndex((value) => value.get('id') === id),
        others_loc: state.getIn(['activeEntries', 'others']).findIndex((value) => value.get('id') === id)
    }
}
export default function guiReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_NAV':
            return state
                .set('nav', action.nav)
        case 'NAV_ENTRY_CLICK':
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
                activeInfo: action.info
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
            state = state.setIn(['activeInfo', action.params.key], new_value)
            var { fav_loc, others_loc } = getAbstractLoc(state)
            if (fav_loc !== -1) {
                state = state.setIn(['activeEntries', 'favorites', fav_loc, action.params.key], new_value)
            } else if (others_loc !== -1) {
                state = state.setIn(['activeEntries', 'others', others_loc, action.params.key], new_value)
            }
            // handle markFav to update abstracts listings
            if (action.operation === 'UPDATE_FAV') {
                if (fav_loc === -1 && others_loc !== -1) {
                    var abstract = state.getIn(['activeEntries', 'others', others_loc])
                    // delete from others
                    state = state.updateIn(['activeEntries', 'others'], others => others.delete(others_loc))
                    // add to favs
                    state = state.updateIn(['activeEntries', 'favorites'], favs => favs.unshift(abstract))
                } else if (fav_loc !== -1 && others_loc === -1) {
                    var abstract = state.getIn(['activeEntries', 'favorites', fav_loc])
                    // delete from favs
                    state = state.updateIn(['activeEntries', 'favorites'], favs => favs.delete(fav_loc))
                    // add to others
                    state = state.updateIn(['activeEntries', 'others'], others => others.unshift(abstract))
                }
            }
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
            var newState = state.set('activeInfo', null) //newState becase the func getAbstractLoc requires original state
            var { fav_loc, others_loc } = getAbstractLoc(state)
            if (fav_loc !== -1) {
                return newState.deleteIn(['activeEntries', 'favorites', fav_loc])
            }
            return newState.deleteIn(['activeEntries', 'others', others_loc])
        case 'SEARCH_COMPLETED':
            return state.set('activeEntries', action.search_results)
        case 'DEACTIVATE_SEARCH':
            return state.set('activeEntries', state.get('currentTabEntries'))
        default:
            return state
    }
}