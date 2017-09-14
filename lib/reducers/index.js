/**
 * Since some processings of the database may be CPU and time consuming, 
 * any gui state updates that rely on database state are done in the action
 * creators by using redux-thunk which made getState() available. In this way,
 * accessing database state is more like accesing a API over the network.
 */
import { combineReducers } from 'redux-immutable'
import { Map } from 'immutable'
import guiReducer from './gui'
import databaseReducer from './db'
import logger from './logger'
export default combineReducers({
    gui: guiReducer,
    db: databaseReducer,
    logger
})