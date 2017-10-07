/**
 * Manages everything that changes the database.
 */
//import { Map, List, fromJS } from 'immutable'
export default function statusReducer(state, action) {
    //console.log('db', state.toJS(), action)
    switch (action.type) {
        case 'ATTEMPT_UNLOCK':
            var newState = state.set('status', action.status)
            if (action.status === 'UNLOCKED')
                newState = newState
                    .set('password', action.password)
                    .set('activeDBLoc', action.location)
            return newState
        case 'CREATE_DB':
            return state.set('status', action.status)
        default:
            return state
    }
}