// Container for nav
import { connect } from 'react-redux'
import { CREATE_DB, ATTEMPT_UNLOCK } from 'actions'
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
    }
})

const SetupWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(Setup)

export default SetupWrapper