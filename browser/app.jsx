import React from 'react'
import SetupWrapper from './components/setup/setupWrapper'
import NavWrapper from './components/nav/navWrapper'
import EntriesWrapper from './components/entries/entriesWrapper'
import InfoWrapper from './components/info/infoWrapper'
import { connect } from 'react-redux'
import { CLOSE_DB } from 'actions'


class App extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    // Save Cache on Exit
    cleanupBeforeUnload = () => {
        if (this.props.unlockStatus === 'UNLOCKED') {
            this.props.closeDB()
        }
    }

    componentDidMount() { // Add a listener to save DB on unload
        window.addEventListener('beforeunload', this.cleanupBeforeUnload)
    }

    // <InfoWrapper />
    render() {
        if (this.props.unlockStatus === 'UNLOCKED') return (
            <div id="app">
                <NavWrapper />
                <EntriesWrapper />
                <InfoWrapper />
            </div>
        )
        else return (
            <div id="app">
                <SetupWrapper />
            </div>
        )
    }
}


const mapStateToProps = state => ({
    unlockStatus: state.getIn(['status', 'unlock'])
})

const mapDispatchToProps = dispatch => ({
    closeDB: () => {
        dispatch(CLOSE_DB())
    }
})

const AppWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

export default AppWrapper
