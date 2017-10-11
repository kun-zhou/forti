import React from 'react'
import TextField from 'material-ui/TextField';
import sty from './sty.cssm'
/**
 * Need to be passed down onSubmits
 */
export default class composeNewDB extends React.Component {
    constructor() {
        super()
        this.state = {
            name: '',
            password: ''
        }
        this.updateName = this.updateName.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    onSubmit() {
        if (this.state.name === '' || this.state.password === '') {
            return
        } else {
            this.props.onSubmit(this.state.name, this.state.password)
        }
    }
    updateName(e) {
        this.setState({ name: e.target.value })
    }

    updatePassword(e) {
        this.setState({ password: e.target.value })
    }

    render() {
        return (
            <div className={sty['name-pass-input']}>
                <TextField
                    margin='dense'
                    label="Name"
                    className={sty['name-input']}
                    onChange={this.updateName}
                />
                <TextField
                    margin='dense'
                    label='Password'
                    type='password'
                    className={sty['password-input']}
                    onChange={this.updatePassword}
                />
                <button
                    className={sty['submit']}
                    onClick={this.onSubmit}
                >
                    SUBMIT
            </button>
            </div>
        )
    }
}
