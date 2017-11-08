import React from 'react'
import sty from './setup.cssm'
import config from '../../utils/config'
import ComposeNewDB from '../public/composeNewDB/composeNewDB.jsx'
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
        console.log(this.state.name + this.state.password)
        if ((this.state.name + this.state.password)) {
            this.props.setupDB(this.state.name, this.state.password)
            this.props.handleRequestClose()
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
        classNameList.push(sty['highlight'])
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
        this.state = { highlighted_db: null, passwd: '', toggle_new_db: false }
    }

    toggleNewDB = () => {
        this.setState({ toggle_new_db: !this.state.toggle_new_db })
    }

    handleDBClick = (location) => {
        this.setState({ highlighted_db: location })
    }

    unlockDB = (e) => {
        if (this.state.highlighted_db) {
            console.log(this.state.highlighted_db, this.state.passwd)
            this.props.unlockDB(this.state.highlighted_db, this.state.passwd)
        } else {
            console.log('Please choose a db')
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

    render() {
        var listOfDB = config.getDBList().map(
            (db) => <DB db={db} highlighted_db={this.state.highlighted_db} handleDBClick={this.handleDBClick} />
        )
        var message = this.props.status
        return (
            <div className={sty['wrapper-row']}>
                <Button
                    style={{ position: 'absolute', left: '20px', bottom: '20px', color: 'grey' }}
                    onClick={this.toggleNewDB}
                >
                    Add New Vault
                </Button>
                <NewDBDialog
                    open={this.state.toggle_new_db}
                    handleRequestClose={this.toggleNewDB}
                    setupDB={this.props.setupDB}
                />
                <div className={sty['database-list']}>
                    <h3>Choose a database</h3>
                    {listOfDB}
                </div>
                <div className={sty['unlock-panel']}>
                    <div className={sty['unlock-password-prompt']}>
                        <TextField
                            margin='dense'
                            label='Master Password Please'
                            type='password'
                            onChange={this.updatePassword}
                            fullWidth
                        />
                        <Button onClick={this.unlockDB}>Submit</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default SelectDB