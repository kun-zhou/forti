import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { fromJS } from 'immutable'

import rootReducer from 'reducers'
import config from './utils/config'

import AppWrapper from './app.jsx'
import { SET_COLOR_SCHEME } from './actions'

// Load fonts and master css
require('./public/css/common.css')
require('./public/fonts/font-awesome/font-awesome-core.css')
require('./public/fonts/font-awesome/font-awesome-light.css')
require('./public/fonts/font-awesome/font-awesome-regular.css')
require('./public/fonts/font-awesome/font-awesome-solid.css')
require('./public/fonts/font-awesome/font-awesome-solid.css')
require('./public/fonts/lato.css')

var response = config.initialize()
var context = response.context
var status = 'SHOW_ALL_DB' //default for CUSTOM context
var activeDBLoc = null
if (response.context === 'DEFAULT') {
  if (config.dbExists(config.getDefaultDBLocation())) { // if default db found
    status = 'DB_LOCATED'
    activeDBLoc = config.getDefaultDBLocation()
  } else {
    status = 'DB_MISSING'
  }
}
if (response.context === 'NO_CONFIG') {
  status = 'NO_CONFIG'
}

var initialStore = {
  status: {
    context: response.context,
    status: status,
    activeDBLoc: activeDBLoc,
    activeDBPasswd: null,
    dbList: config.getDBList()
  },
  gui: {
    status: response, // {string}
    activePane: null, // {string}
    activeNavTab: null, // {string}
    activeNavTabType: null,
    activeEntries: [],
    activeEntry: null, // id string
    searchActive: false,
    entries_rerender: true,
    modal: null,
    modalResponse: null,
  },
  db: {},
  logger: {}
}

const store = createStore(rootReducer, fromJS(initialStore), applyMiddleware(thunk))
store.dispatch(SET_COLOR_SCHEME(config.getDefaultColorScheme()))

render(
  <Provider store={store}>
    <AppWrapper />
  </Provider>,
  document.getElementById('root')
)