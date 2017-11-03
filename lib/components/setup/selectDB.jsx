import React from 'react'
import sty from './setup.cssm'
import config from '../../utils/config'
import ComposeNewDB from '../public/composeNewDB/composeNewDB.jsx'


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
        this.handleDBClick = this.handleDBClick.bind(this)
        this.unlockDB = this.unlockDB.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
        this.setupDB = this.setupDB.bind(this)
    }

    handleDBClick(location) {
        this.setState({ highlighted_db: location })
    }

    unlockDB(e) {
        if (this.state.highlighted_db) {
            console.log(this.state.highlighted_db, this.state.passwd)
            this.props.unlockDB(this.state.highlighted_db, this.state.passwd)
        } else {
            console.log('Please choose a db')
        }
    }

    updatePassword(e) {
        this.setState({ passwd: e.target.value })
    }

    setupDB(name, passwd) {
        this.props.setupDB(name, passwd)
        this.forceUpdate()
    }
    render() {
        var listOfDB = config.getDBList().map(
            (db) => <DB db={db} highlighted_db={this.state.highlighted_db} handleDBClick={this.handleDBClick} />
        )
        var message = this.props.status
        var newDBPrompt = this.state.toggle_new_db ?
            <ComposeNewDB onSubmit={this.setupDB} />
            :
            <div onClick={() => { this.setState({ toggle_new_db: true }) }}>
                Create new DB
            </div>

        return (
            <div className={sty['wrapper-row']}>
                <div className={sty['database-list']}>
                    {listOfDB}
                    {newDBPrompt}
                </div>
                <div className={sty['unlock-panel']}>
                    Unlock your DB
                    <input style={{ width: '100px' }} value={this.state.passwd} onChange={this.updatePassword} type='password' />
                    <button onClick={this.unlockDB}>Submit</button>
                    {message}
                </div>
            </div>
        )
    }
}

export default SelectDB
