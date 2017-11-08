/**
 * Manages everything that changes the database.
 */
export default function manifestReducer(state, action) {
    switch (action.type) {
        case 'ATTEMPT_UNLOCK':
            if (action.success) {
                console.log('unlocked', action)
                return Object.assign({}, state, action.manifest)
            }
            return state
        default:
            return state
    }
}