import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { fromJS } from 'immutable'
import rootReducer from 'reducers'
import config from './utils/config'

import logger from './logger'

import AppWrapper from './app.jsx'
import { SET_COLOR_SCHEME } from './actions'

// Load fonts and master css
require('./public/css/common.css')
require('./public/fonts/font-awesome/fontawesome-pro-core.css')
require('./public/fonts/font-awesome/fontawesome-pro-light.css')
require('./public/fonts/font-awesome/fontawesome-pro-regular.css')
require('./public/fonts/font-awesome/fontawesome-pro-solid.css')
require('./public/fonts/quicksand.css')

var status = config.initialize().status

var initialState = {
  status: {
    status: status,
    activeVaultLoc: null,
    activeVaultPasswd: null,
    activeVaultKey: null,
  },
  gui: {
    nav: null,
    activePane: null, // {string}
    activeNavTab: null, // {string}
    activeNavTabType: null,
    activeEntries: null,
    activeEntry: null, // id string
    searchActive: false,
    activeInfo: null,
  },
}

const store = createStore(rootReducer, fromJS(initialState), applyMiddleware(thunk, logger))

store.dispatch(SET_COLOR_SCHEME())

render(
  <Provider store={store}>
    <AppWrapper />
  </Provider>,
  document.getElementById('root')
)