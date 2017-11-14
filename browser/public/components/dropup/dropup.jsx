import React from 'react'
import sty from './dropup.cssm'
import makeAutohide from 'public/components/Autohide/Autohide.jsx'

function Entry({ entry, icon, callback }) {
    return (
        <div className={sty['entry-wrapper']} onClick={() => { callback(entry) }}>
            <i className={'far fa-fw fa-lg ' + icon} />{entry}
        </div >
    )
}

function Dropup({ entries, callback }) {
    var entriesNodes = entries.map(
        (icon, entry) => (<Entry entry={entry} icon={icon} callback={callback} />)
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
            dropup_shown: false
        }
        this.toggleDropup = this.toggleDropup.bind(this)
    }

    toggleDropup() {
        this.setState({ dropup_shown: !this.state.dropup_shown })
    }

    render() {
        if (this.state.dropup_shown)
            return (
                <div className={sty['btn-add-entry']} ref={e => e ? e.focus() : {}}>
                    <AutohideDropup
                        onHide={this.toggleDropup}
                        callback={(entry) => { this.props.callback(entry); this.toggleDropup() }}
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
                    <i className='far fa-fw fa-lg fa-plus' />
                </button>
            </div>
        )
    }
}
export default DropupWithBtn