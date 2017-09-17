/**
 * Manages everything that changes the database.
 */
import { Map, List, fromJS } from 'immutable'
export default function dataReducer(state, action) {
    //console.log('db', state.toJS(), action)
    switch (action.type) {
        case 'ATTEMPT_UNLOCK':
            if (action.status === 'UNLOCKED')
                return fromJS(action.db)
            else return state

        case 'EDIT_TITLE':
            return state.setIn(
                ['entries', action.id, 'title'], action.value
            )
        case 'EDIT_SECTION_HEADER':
            return state
                //update sections order
                .updateIn(['entries', action.id, 'sections_order'], (sections) =>
                    sections.set(sections.indexOf(action.section_header), action.new_header)
                )
                //update sections
                .updateIn(['entries', action.id, 'sections'], (sections) => {
                    return sections.mapKeys(s => {
                        if (s === action.section_header)
                            return action.new_header
                        return s
                    })
                })
        case 'EDIT_FIELD':
            var propertyIdx = action.property === 'name' ? 0 : (action.property === 'content' ? 1 : 2)
            return state.setIn(
                ['entries', action.id, 'user_defined', action.field_id, propertyIdx], action.value
            )
        case 'DEL_FIELD':
            return state
                // delete field in the sections
                .updateIn(['entries', action.id, 'sections', action.section], fields => {
                    var idx = fields.indexOf(action.field_id)
                    if (action.field_id !== -1) { return fields.splice(idx, 1) }
                    console.log('field to be deleted does not exist')
                    return fields
                })
                // delete field in userdefined
                .deleteIn(['entries', action.id, 'user_defined', action.field_id])
        // delete section if empty
        case 'ADD_FIELD':
            return state
                .updateIn(['entries', action.id, 'sections', action.section],
                (list) => list.push(action.field_id))
                .setIn(['entries', action.id, 'user_defined', action.field_id], List(['', '', action.field_type]))
        case 'MARK_FAV':
            return state.withMutations(
                (state) => {
                    state.setIn(['entries', action.id, 'favorite'], true)
                    state.update('favorites_keys', (list) => list.unshift(action.id))
                }
            )
        case 'UNMARK_FAV':
            return state.withMutations(
                (state) => {
                    state.setIn(['entries', action.id, 'favorite'], false)
                    state.update('favorites_keys', (list) => {
                        var del_idx = list.indexOf(action.id)
                        if (del_idx !== -1) {
                            return list.splice(del_idx, 1)
                        } else {
                            throw 'Entry to be unmarked as favorite is not already favorite'
                        }
                    })
                }
            )
        case 'CREATE_ENTRY':
            // add category if it does not exist
            var newState = state
            // Incomplete snippet
            if (!state.get('categories_order').includes(action.category)) {
                newState = newState
                    .update('categories_order', (list) => list.push(action.category))
                    .setIn(['categories_keys', action.category], List())
                    .setIn(['categories_icon', action.category], 'fa-bookmark')
            }
            var entry = fromJS(
                {
                    id: action.newId,
                    title: 'Untitled..',
                    category: action.category,
                    tags: [],
                    time_created: action.currentTime,
                    time_modified: action.currentTime
                }
            )
            entry = entry.merge(fromJS(action.template))
            // Add to list trackers
            return newState
                .updateIn(['categories_keys', action.category], (list) => list.push(action.newId))
                .update('all_keys', (list) => list.push(action.newId))
                .setIn(['entries', action.newId], entry)
        case 'DELETE_ENTRY':
            var newState = state
            var id = action.id
            var tags = state.getIn(['entries', id, 'tags'])
            // update tag key
            tags.forEach((tag) => {
                newState = newState.updateIn(['tags_keys', tag], (list) => list.splice(list.indexOf(id), 1))
            })
            // update category keys
            newState = newState.updateIn(['categories_keys', state.getIn(['entries', id, 'category'])], (list) => list.splice(list.indexOf(id), 1))
            // update all keys
            newState = newState.update('all_keys', (list) => list.splice(list.indexOf(id), 1))
            newState = newState.update('favorites_keys', (list) => list.splice(list.indexOf(action.id), 1))
            return newState
        case 'ADD_TAG': // add tag to entry
            var newState = state
            // check if tag already exist
            if (state.getIn(['entries', action.id, 'tags']).includes(action.tag)) {
                return newState
            }
            // update tags_order, tags_keys, and tags_color
            if (!state.get('tags_order').includes(action.tag)) {
                newState = newState
                    .update('tags_order', (list) => list.push(action.tag))
                    .setIn(['tags_keys', action.tag], List())
                    .setIn(['tags_color', action.tag], action.color)
            }
            return newState
                .updateIn(['entries', action.id, 'tags'], (list) => list.push(action.tag))
                .updateIn(['tags_keys', action.tag], (list) => list.push(action.id))
        case 'DEL_TAG':
            var newState = state
            // check if tag already gone
            if (!state.getIn(['entries', action.id, 'tags']).includes(action.tag)) {
                return newState
            }
            return newState
                .updateIn(['entries', action.id, 'tags'], (list) => list.splice(list.indexOf(action.tag), 1))
                .updateIn(['tags_keys', action.tag], (list) => list.splice(list.indexOf(action.id), 1))
        case 'DELETE_TAG_FROM_NAV':
            var newState = state
                .update('tags_order', (list) => list.splice(list.indexOf(action.tag), 1))
                .deleteIn(['tags_keys', action.tag])
                .deleteIn(['tags_color', action.tag])
                .update('entries', (entries) => {
                    return entries.map((entry) => {
                        var idx = entry.get('tags').indexOf(action.tag)
                        if (idx !== -1)
                            return entry.update('tags', (tags) => tags.splice(idx, 1))
                        return entry
                    })
                })
            return newState
        case 'CHANGE_TAG_COLOR':
            return state.setIn(['tags_color', action.tag], action.color)
        //return state
        default:
            return state
    }
}
