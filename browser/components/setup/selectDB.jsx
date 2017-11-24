import React from 'react'
import sty from './setup.cssm'
import config from '../../utils/config'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';


class NewDBDialog extends React.PureComponent {
    constructor() {
        super()
        this.state = { name: '', password: '' }
        this.handleFormChange = this.handleFormChange.bind(this)
        this.createVault = this.createVault.bind(this)
    }

    handleFormChange(field) {
        return (event) => {
            this.setState({ [field]: event.target.value })
        }
    }

    createVault() {
        if ((this.state.name + this.state.password)) {
            this.props.setupDB(this.state.name, this.state.password)
        }
    }

    render() {
        return (
            <Dialog open={this.props.open} onRequestClose={this.props.handleRequestClose}>
                <DialogTitle>Create New Vault</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter name and password for your new vault.
                </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Database Name"
                        type="text"
                        fullWidth
                        onChange={this.handleFormChange('name')}
                    />
                    <TextField
                        margin="dense"
                        label="Database Password"
                        type="password"
                        fullWidth
                        onChange={this.handleFormChange('password')}
                    />
                    <p style={{ height: '20px', color: 'red' }}>{this.props.message === 'PASSWORD_INVALID' ? 'Password needs to be at least 8 characters long' : this.props.message}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleRequestClose} color="accent">
                        Cancel
                    </Button>
                    <Button onClick={this.createVault} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

function DB({ db, highlighted_db, handleDBClick }) {
    var classNameList = [sty['db-block']]
    if (highlighted_db === db.location) {
        classNameList.push(sty['is-selected'])
    }
    return (
        <div
            className={classNameList.join(' ')}
            onClick={() => { handleDBClick(db.location) }}
        >
            {db.name}
        </div>
    )
}

class SelectDB extends React.PureComponent {
    constructor() {
        super()
        var defaultDB = config.getDefaultDBLocation()
        this.state = { highlighted_db: defaultDB ? defaultDB : null, passwd: '', toggle_new_db: false }
    }

    toggleNewDB = () => {
        this.setState({ toggle_new_db: !this.state.toggle_new_db })
    }

    handleDBClick = (location) => {
        this.setState({ highlighted_db: location })
    }

    unlockDB = (e) => {
        if (this.state.highlighted_db) {
            this.props.unlockDB(this.state.highlighted_db, this.state.passwd)
        } else {
            this.setState({ message: 'Please Select a Vault' })
        }
    }

    updatePassword = (e) => {
        this.setState({ passwd: e.target.value })
    }

    setupDB = (name, passwd) => {
        this.props.setupDB(name, passwd)
        this.toggleNewDB()
        //this.forceUpdate()
    }

    componentWillUpdate(nextProps) {
        if (this.state.toggle_new_db && nextProps.status === 'SELECT_DB')
            this.setState({ toggle_new_db: false })
    }

    render() {
        var listOfDB = config.getDBList().map(
            (db) => <DB db={db} highlighted_db={this.state.highlighted_db} handleDBClick={this.handleDBClick} />
        )
        var helperText

        if (this.state.toggle_new_db || this.props.status === 'SELECT_DB') {
            helperText = ''
        } else {
            helperText = this.props.status
        }
        return (
            <div className={sty['wrapper-select-db']}>
                <Button
                    style={{ position: 'absolute', top: '20px', right: '20px', color: 'grey' }}
                    onClick={this.toggleNewDB}
                >
                    Add New Vault
                </Button>
                <NewDBDialog
                    open={this.state.toggle_new_db}
                    handleRequestClose={this.toggleNewDB}
                    setupDB={this.props.setupDB}
                    message={this.props.status !== 'SELECT_DB' ? this.props.status : ''}
                />
                <div className={sty['database-list']}>
                    <h2 className={sty['database-list-header']}>Vaults</h2>
                    {listOfDB}
                </div>
                <div className={sty['unlock-panel']}>
                    <div className={sty['unlock-password-prompt']}>
                        <TextField
                            margin='dense'
                            label='Master Password'
                            type='password'
                            onChange={this.updatePassword}
                            FormHelperTextProps={{
                                error: true
                            }}
                            helperText={helperText}
                            fullWidth
                        />
                        <Button classes={{ root: sty['btn-confirm-password'] }} raised color="primary" onClick={this.unlockDB}>UNLOCK</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default SelectDB
