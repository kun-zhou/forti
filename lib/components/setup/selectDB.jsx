import React from 'react'
import sty from './setup.cssm'

class DB extends React.PureComponent {
    constructor() {
        super()
        this.handleClick = this.handleClick(this)
    }

    handleClick() {
        //this.props.selectDB(this.props.idx)
    }

    render() {
        return (
            <div
                className={sty['db-block']}
                onClick={this.handleClick}
            >
                {this.props.name}
            </div>
        )
    }
}

class SelectDB extends React.PureComponent {
    render() {
        var listOfDB = this.props.status.get('dbList').map(
            (db) => <DB name={db.get('name')} location={db.get('location')}  />
        )
        /*
        switch (this.props.status.get('status')) {
            //case 'DEFAULT_DB_MISSING':
            //case 'DB_MISSING:
            
        }
        */
        /*
        const unlockTemplate = (
            <div id={sty['container']} style={{ justifyContent: 'center' }}>
                <div id={sty['password-input-wrapper']}>
                    <input
                        id={sty['password-input']}
                        placeholder='master password please'
                        value={this.state.value}
                        type='password'
                        onChange={this.handleChange}
                    />
                    <div
                        id={sty['submit']}
                        onClick={this.handleSubmit}
                    >
                        Confirm
                            </div>
                </div>
            </div>
        )
        if (this.props.status.get('status') === 'DB_SELECTED') {
            var content = unlockTemplate
        } else { // DB MISSING
            content = null
        }*/
        return (
            <div id={sty['container']}>
                {listOfDB}
            </div>
        )
    }
}

export default SelectDB
