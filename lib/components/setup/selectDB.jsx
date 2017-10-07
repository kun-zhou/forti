import React from 'react'
import sty from './setup.cssm'

class DB extends React.PureComponent {
    constructor() {
        super()
        this.handleClick = this.handleClick(this)
    }

    handleClick() {
        this.props.selectDB(this.props.idx)
    }

    render() {
        return (
            <div
                className={sty['db-block']}
                onClick={handleClick}
            >
                {this.props.name}
            </div>
        )
    }
}

class SelectDB extends React.PureComponent {
    render() {
        var listOfDB = this.props.db.map(
            (db, idx) => <DB name={db['name']} idx={idx} handleClick={this.props.handleClick} />
        )
        return (
            <div id={css['container']}>
                {listOfDB}
            </div>
        )
    }
}

export default SelectDB
