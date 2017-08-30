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
    componentDidMount() { // Add a listener to save DB on unload
        var props = this.props
        window.addEventListener('beforeunload',
            function onbeforeunload(e) {
                props.saveDB()
            })
    }

    render() {
        if (this.props.status === "UNLOCKED") return (
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