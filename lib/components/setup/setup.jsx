import React from 'react'
import css from './setup.cssm'
import config from '../../utils/config'
import SelectDB from './selectDB.jsx'
class Setup extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = { value: '' }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({ value: event.target.value })
    }

    handleSubmit(event) {
        if (this.props.status === 'NO_CONFIG') {
            this.props.setupDB(this.state.value)
            this.setState({ value: '' })
        } else if (this.props.status === 'DEFAULT_DB_LOCATED') {
            this.props.unlockDB(config.getDefaultDBLocation(), this.state.value)
        } else {
            this.props.unlockDB(config.getDefaultDBLocation(), this.state.value)
        }
    }
    render() {
        switch (this.props.status) { // i.e., LOCKED
            case 'NO_CONFIG':
            case 'NO_DB_FOUND':
                return (
                    <div id={css['container']}>
                        <div id={css['prompt']}>Creating a new encrypted database</div>
                        <div id={css['password-input-wrapper']}>
                            <input
                                id={css['password-input']}
                                placeholder='new master password please'
                                value={this.state.value}
                                type='password'
                                onChange={this.handleChange}
                            />
                            <div
                                id={css['submit']}
                                onClick={this.handleSubmit} >
                                Confirm
                        </div>
                        </div>
                    </div>
                )
            case 'DEFAULT_DB_LOCATED':
            case 'DB_LOCATED':
                return ( //Default to unlocking
                    <div id={css['container']} style={{ justifyContent: 'center' }}>
                        <div id={css['password-input-wrapper']}>
                            <input
                                id={css['password-input']}
                                placeholder='master password please'
                                value={this.state.value}
                                type='password'
                                onChange={this.handleChange}
                            />
                            <div
                                id={css['submit']}
                                onClick={this.handleSubmit}
                            >
                                Confirm
                            </div>
                        </div>
                    </div>
                )
            case 'PASSWORD_ERROR':
                return (
                    <div id={css['container']} style={{ justifyContent: 'center' }}>
                        <div id={css['password-input-wrapper']}>
                            <div id={css['password-error-warning']}>Password Error!</div>
                            <input
                                id={css['password-input-err']}
                                placeholder='master password please'
                                value={this.state.value}
                                type='password'
                                onChange={this.handleChange}
                            />
                            <div
                                id={css['submit']}
                                onClick={this.handleSubmit} >
                                Confirm
                        </div>
                        </div>
                    </div>
                )

            case 'SHOW_LIST_OF_DB':
                return <SelectDB {...props} />
        }
    }
}

export default Setup
