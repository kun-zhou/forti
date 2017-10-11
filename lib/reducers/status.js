/**
 * Manages everything that changes the database.
 */
//import { Map, List, fromJS } from 'immutable'
export default function statusReducer(state, action) {
    //console.log('db', state.toJS(), action)
    switch (action.type) {
        case 'SELECT_DB':
            return state
                .set('status', action.status)
                .set('activeDBLoc', action.db_loc)
        case 'ATTEMPT_UNLOCK':
            var newState = state.set('status', action.status)
            if (action.status === 'UNLOCKED') {
                newState = newState.set('activeDBPasswd', action.password)
            }
            return newState
        case 'CREATE_DB':
            if (action.firstTimeSetup)
                return state
                    .set('status', action.status)
                    .set('dbList', action.db_list)
                    .set('activeDBLoc', action.db_loc)
            else return state.set('dbList', action.db_list)
        default:
            return state
    }
}