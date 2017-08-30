/**
 * Logs action
 */

export default function loggerReducer(state, action) {
    console.log(action)
    return state.set('last_action', action.type)
}