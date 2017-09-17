
import React from 'react'
import sty from './sty.cssm'
import makeAutohide from 'public/components/Autohide/Autohide.jsx'

function Entry({ entry, callback }) {
    return (
        <div className={sty['entry-wrapper']} onClick={() => { callback(entry) }}>
            {entry}
        </div >
    )
}

function Dropdown({ entries, callback }) {
    var entriesNodes = entries.map(
        (entry) => (<Entry entry={entry} callback={callback} />)
    )
    return (
        <div className={sty['dropdown']}>
            {entriesNodes}
        </div>
    )
}

const AutohideDropdown = makeAutohide(Dropdown)

// Accept templates variable and a callback function with template as input
class DropdownWithBtn extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            dropdown_shown: false
        }
        this.toggleDropdown = this.toggleDropdown.bind(this)
    }

    toggleDropdown(e) {
        e.nativeEvent.stopImmediatePropagation()
        this.setState({ dropdown_shown: !this.state.dropdown_shown })
    }

    render() {
        if (this.state.dropdown_shown) {
            return (
                <div style={{ position: 'relative' }}>
                    <AutohideDropdown
                        onHide={this.toggleDropdown}
                        callback={(entry) => { this.props.callback(entry); this.toggleDropup() }}
                        entries={this.props.entries}
                    />
                    <button key='field_btn'
                        className={sty['btn-add']}
                        onClick={this.toggleDropdown}
                    >
                        {this.props.button}
                    </button>
                </div>
            )
        }
        return (
            <button key='field_btn'
                className={sty['btn-add']}
                onClick={this.toggleDropdown}
            >
                {this.props.button}
            </button>
        )
    }
}
export default DropdownWithBtn