import React from 'react'
import sty from './setup.cssm'
import config from '../../utils/config'

class DBFocused extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = { password: '' } // user entered password is kept here
        this.updatePassword = this.updatePassword.bind(this)
        this.createFirstDB = this.createFirstDB.bind(this)
        this.unlockDB = this.unlockDB.bind(this)
    }

    updatePassword(event) {
        this.setState({ password: event.target.value })
    }

    createFirstDB() {
        this.props.setupDB(this.state.password, true)
        this.setState({ password: '' })
    }

    unlockDB() {
        this.props.unlockDB(this.props.status.get('activeDBLoc'), this.state.password)
        this.setState({ password: '' })
    }

    render() {
        switch (this.props.status.get('status')) {
            case 'NO_CONFIG':
                return (
                    <div id={sty['container']}>
                        <div id={sty['prompt']}>Welcome to Lockit, Let's create a new encrypted database for you</div>
                        <div id={sty['password-input-wrapper']}>
                            <input
                                id={sty['password-input']}
                                placeholder='please enter a master password for this encrypted database'
                                value={this.state.password}
                                type='password'
                                onChange={this.updatePassword}
                            />
                            <div
                                id={sty['submit']}
                                onClick={this.createFirstDB} >
                                Confirm
                        </div>
                        </div>
                    </div>
                )
            case 'DB_LOCATED':
                return ( //Default to unlocking
                    <div id={sty['container']} style={{ justifyContent: 'center' }}>
                        <div id={sty['password-input-wrapper']}>
                            <input
                                id={sty['password-input']}
                                placeholder='master password please'
                                value={this.state.password}
                                type='password'
                                onChange={this.updatePassword}
                            />
                            <div
                                id={sty['submit']}
                                onClick={this.unlockDB}
                            >
                                Confirm
                            </div>
                        </div>
                    </div>
                )
            case 'PASSWORD_ERROR':
                return (
                    <div id={sty['container']} style={{ justifyContent: 'center' }}>
                        <div id={sty['password-input-wrapper']}>
                            <div id={sty['password-error-warning']}>Password Error!</div>
                            <input
                                id={sty['password-input-err']}
                                placeholder='master password please'
                                value={this.state.password}
                                type='password'
                                onChange={this.updatePassword}
                            />
                            <div
                                id={sty['submit']}
                                onClick={this.unlockDB} >
                                Confirm
                        </div>
                        </div>
                    </div>
                )
            case 'DB_MISSING':
                return ( //Default to unlocking
                    <div id={sty['container']} style={{ justifyContent: 'center' }}>
                        Sorry, the default database is either missing or not-specified in the configuration.
                    </div>
                )// provide a button to go to custom view
        }
        return null
    }
}

export default DBFocused