import React from 'react'
import SetupWrapper from './components/setup/setupWrapper'
import ModalWrapper from './components/modal/ModalWrapper'
import NavWrapper from './components/nav/navWrapper'
import EntriesWrapper from './components/entries/entriesWrapper'
import InfoWrapper from './components/info/infoWrapper'
import { connect } from 'react-redux'
import config from './backend/config'
import { SAVE_DB } from 'actions'

class App extends React.PureComponent {
    constructor(props) {
        super(props)
        this.saveDB = this.saveDB.bind(this)
    }

    // Save Database on Exit
    saveDB() {
        if (this.props.status === 'UNLOCKED') {
            this.props.saveDB()
        }
    }
    componentDidMount() { // Add a listener to save DB on unload
        window.addEventListener('beforeunload', this.saveDB)
    }

    render() {
        if (this.props.status === 'UNLOCKED') return (
            <div id="app">
                <ModalWrapper />
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
    status: state.getIn(['gui', 'status']),
})

const mapDispatchToProps = dispatch => ({
    saveDB: () => {
        dispatch(SAVE_DB())
    }
})


const AppWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

export default AppWrapper