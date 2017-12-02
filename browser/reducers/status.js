/**
 * Manages everything that changes the database.
 */
//import { Map, List, fromJS } from 'immutable'
export default function statusReducer(state, action) {
    switch (action.type) {
    case 'ATTEMPT_UNLOCK':
        return state.set('unlock', action.status)
    case 'CREATE_DB_PENDING':
        return state.set('dbCreation', 'PENDING')
    case 'CREATE_DB_DONE':
        return state.set('dbCreation', action.status)
    default:
        return state
    }
}