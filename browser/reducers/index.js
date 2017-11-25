/**
 * Since some processings of the database may be CPU and time consuming, 
 * any gui state updates that rely on database state are done in the action
 * creators by using redux-thunk which made getState() available. In this way,
 * accessing database state is more like accesing a API over the network.
 */

import guiReducer from './gui'
import cacheReducer from './cache'
import statusReducer from './status'
import configReducer from './config'

import { combineReducers } from 'redux-immutable'


export default combineReducers({
    gui: guiReducer,
    cache: cacheReducer,
    status: statusReducer,
    config: configReducer,
})
