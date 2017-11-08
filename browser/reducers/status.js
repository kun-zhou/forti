/**
 * Manages everything that changes the database.
 */
//import { Map, List, fromJS } from 'immutable'
export default function statusReducer(state, action) {
    switch (action.type) {
        case 'ATTEMPT_UNLOCK':
            if (!action.success) {
                return Object.assign({}, state, { status: 'PASSWORD_ERROR' })
            }
            return Object.assign({}, state,
                {
                    status: action.status,
                    activeVaultLoc: action.location,
                    activeVaultPasswd: action.password,
                    activeVaultKey: action.key
                }
            )
        case 'CREATE_DB':
            if (state.status === 'WELCOME')
                return Object.assign({}, state, { status: 'SELECT_DB' })
            return state
        default:
            return state
    }
}