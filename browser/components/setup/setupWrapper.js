// Container for nav
import {ATTEMPT_UNLOCK, CREATE_DB, DELETE_DB} from 'actions'
import {connect} from 'react-redux'

import Setup from './setup.jsx'

// Functions
const mapStateToProps = state => ({
  status: state.get('status'),
})

const mapDispatchToProps = dispatch => ({
  setupDB: (name, password) => {
    return dispatch(CREATE_DB(name, password))
  },
  unlockDB: (location, password) => {
    dispatch(ATTEMPT_UNLOCK(location, password))
  },
  deleteDB: (location) => {
    dispatch(DELETE_DB(location))
  }
})

const SetupWrapper = connect(mapStateToProps, mapDispatchToProps)(Setup)

export default SetupWrapper