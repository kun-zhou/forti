import React from 'react'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/Button'
import sty from './sty.cssm'

export default class composeNewDB extends React.PureComponent {
    constructor() {
        super()
        this.state = {
            name: '',
            password: ''
        }
    }

    onSubmit = () => {
        if (this.state.name === '' || this.state.password === '') {
            return
        } else {
            this.props.onSubmit(this.state.name, this.state.password)
        }
    }

    updateName = (e) => {
        this.setState({ name: e.target.value })
    }

    updatePassword = (e) => {
        this.setState({ password: e.target.value })
    }

    render() {
        var Cancel = this.props.hasCancel ?
            <FlatButton color={"accent"} onClick={this.props.onCancelClick}>Cancel</FlatButton> :
            null
        return (
            <div className={this.props.className}>
                <TextField
                    margin='dense'
                    label="Name"
                    className={sty['name-input']}
                    onChange={this.updateName}
                    style={{ width: '30%' }}
                />
                <TextField
                    margin='dense'
                    label='Password'
                    type='password'
                    className={sty['password-input']}
                    onChange={this.updatePassword}
                    style={{ width: '30%' }}
                />
                <FlatButton onClick={this.onSubmit}>SUBMIT</FlatButton>
                {Cancel}
            </div>
        )
    }
}