import React from 'react'
import css from './setup.cssm'

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
        if (this.props.status === 'HELLO_WORLD') {
            this.props.setupDB(this.state.value)
            this.setState({ value: '' })
        } else {
            this.props.unlockDB(this.state.value)
        }
    }
    render() {
        console.log(this.props.status)
        if (this.props.status === 'ENCRYPTED_DB_LOCATED') // i.e., LOCKED
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
                            onClick={this.handleSubmit} >
                            Confirm
                        </div>
                    </div>
                </div>
            )
        if (this.props.status === 'PASSWORD_ERROR')
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
        if (this.props.status === 'HELLO_WORLD')
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
        else console.log(this.props.status)
    }
}

export default Setup