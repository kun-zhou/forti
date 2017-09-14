// Container for nav
import { connect } from 'react-redux'
import { CREATE_DB, ATTEMPT_UNLOCK } from 'actions'
import Setup from './setup.jsx'

// Functions
const mapStateToProps = state => ({
    status: state.getIn(['gui', 'status']),
})

const mapDispatchToProps = dispatch => ({
    setupDB: (password) => {
        dispatch(CREATE_DB(password))
    },
    unlockDB: (password) => {
        dispatch(ATTEMPT_UNLOCK(password))
    }
})

const SetupWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(Setup)

export default SetupWrapper