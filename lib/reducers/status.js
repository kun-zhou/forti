/**
 * Manages everything that changes the database.
 */
//import { Map, List, fromJS } from 'immutable'
export default function statusReducer(state, action) {
    //console.log('db', state.toJS(), action)
    switch (action.type) {
        case 'ATTEMPT_UNLOCK':
            var newState = state.set('status', action.status)
            if (action.status === 'UNLOCKED') {
                newState = newState.set('activeDBPasswd', action.password)
            }
            return newState
        case 'CREATE_DB':
            if (state.get('status') === 'WELCOME')
                return state.set('status', 'SELECT_DB')
            else return state
        default:
            return state
    }
}