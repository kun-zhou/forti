/**
 * Since some processings of the database may be CPU and time consuming, 
 * any gui state updates that rely on database state are done in the action
 * creators by using redux-thunk which made getState() available. In this way,
 * accessing database state is more like accesing a API over the network.
 */

import statusReducer from './status'
import manifestReducer from './manifest'
import guiReducer from './gui'
import logger from './logger'
import { combineReducers } from 'redux'
/*
export default combineReducers({
    status: statusReducer,
    manifest: manifestReducer,
    gui: guiReducer,
    logger: logger
})
*/
export default function reducer(state, action) {
    console.log('action', action, state)
    return {
        status: statusReducer(state.status, action),
        gui: guiReducer(state.gui, action),
    }
}