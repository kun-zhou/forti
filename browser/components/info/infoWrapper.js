import { connect } from 'react-redux'
import { CREATE_SECRET, DELETE_SECRET, UPDATE_META, UPDATE_CUSTOM } from 'actions'
//import Info from './info.jsx' currently being replaced by the elm version
import React from 'react'
import Elm from 'react-elm-components'
import { Test } from '../../Test.elm'
console.log('Test', Test)

// Helper Functions
const mapStateToProps = state => {
    return {
        info: state.getIn(['gui', 'activeInfo']),
        categories_config: state.getIn(['config', 'categories'])
    }
}

const mapDispatchToProps = dispatch => ({
    updateMeta: (operation, params) => {
        dispatch(UPDATE_META(operation, params))
    },
    updateCustom: (operation, params) => {
        dispatch(UPDATE_CUSTOM(operation, params))
    },
    createSecret: (category) => {
        dispatch(CREATE_SECRET(category))
    },
    deleteSecret: () => {
        dispatch(DELETE_SECRET())
    }
})

class Info extends React.Component {
    constructor() {
        super()
        this.state = {}
        this.setupPorts = this.setupPorts.bind(this)
    }
    /*
        componentWillReceiveProps(nextProps){
            this.state.setupPorts.
        }
    */
    setupPorts(ports) {
        this.setState({ ports })
        ports.logPassword.subscribe(function (password) {
            console.log(password)
            ports.newInfo.send(password)
        })

    }

    render() {
        return <Elm src={Test} ports={this.setupPorts} />
    }
}
const InfoWrapper = connect(mapStateToProps, mapDispatchToProps)(Info)

export default InfoWrapper