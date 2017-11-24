import React from 'react'
import sty from './dropup.cssm'
import makeAutohide from 'public/components/Autohide/Autohide.jsx'

function Item({ name, icon, callback }) {
    return (
        <div className={sty['entry-wrapper']} onClick={() => { callback(name) }}>
            <i className={'fal fa-fw fa-lg ' + icon + ' ' + sty['icon']} />{name}
        </div >
    )
}

function Dropup({ entries, callback }) {
    var entriesNodes = entries.map(
        (icon, entry) => (<Item name={entry} icon={icon} callback={callback} />)
    )
    return (
        <div className={sty['dropup']}>
            {entriesNodes}
        </div>
    )
}

const AutohideDropup = makeAutohide(Dropup)

// Accept templates variable and a callback function with template as input
class DropupWithBtn extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
        this.toggleDropup = this.toggleDropup.bind(this)
    }

    toggleDropup() {
        this.setState({ open: !this.state.open })
    }

    handleItemClick = (type) => () => {
        this.props.handleClick(type)
        this.setState({ open: !this.state.open })
    }

    render() {
        if (this.state.open)
            return (
                <div className={sty['btn-add-entry']}>
                    <AutohideDropup
                        onHide={this.toggleDropup}
                        callback={this.handleItemClick}
                        entries={this.props.entries}
                    />
                    <button
                        className={sty['btn-add']}
                        onClick={this.toggleDropup}
                    >
                        <i className='far fa-fw fa-lg fa-plus' />
                    </button>
                </div>)
        return (
            <div className={sty['btn-add-entry']}>
                <button
                    className={sty['btn-add']}
                    onClick={this.toggleDropup}
                >
                    <i className='fal fa-fw fa-lg fa-plus' />
                </button>
            </div>
        )
    }
}
export default DropupWithBtn