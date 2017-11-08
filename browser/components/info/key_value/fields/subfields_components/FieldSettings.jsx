import React from 'react'
import sty from '../../sty.cssm'
import makeAutohide from 'public/components/Autohide/Autohide.jsx'

function Entry({ entry, callback }) {
    return (
        <div className={sty['entry-wrapper']} onClick={callback}>
            {entry}
        </div >
    )
}

function Dropdown({ entries_callbacks, toggleDropdown }) {
    var entriesNodes = entries_callbacks.map(
        (entry_callback) => (<Entry entry={entry_callback[0]} callback={entry_callback[1]} />)
    )
    return (
        <div className={sty['dropdown']}>
            {entriesNodes}
        </div>
    )
}

const AutohideDropdown = makeAutohide(Dropdown)

// Accept templates variable and a callback function with template as input
class FieldSettings extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            dropdown_shown: false
        }
        this.toggleDropdown = this.toggleDropdown.bind(this)
        this.entries_callbacks = [
            ['delete', () => { props.delField(); this.toggleDropdown() }],
            ['to text', () => { props.toggleTypeText; this.toggleDropdown() }],
            ['to code', () => { props.toggleTypeCode; this.toggleDropdown() }],
            ['to link', () => { props.toggleTypeLink; this.toggleDropdown() }],
            ['to note', () => { props.toggleTypeNote; this.toggleDropdown() }],
        ]
    }

    toggleDropdown(e) {
        this.setState({ dropdown_shown: !this.state.dropdown_shown })
    }

    render() {

        var dropdown = null
        var boldness = 'fal'
        if (this.state.dropdown_shown) {
            dropdown = (
                <AutohideDropdown
                    onHide={this.toggleDropdown}
                    entries_callbacks={this.entries_callbacks}
                />
            )
            boldness = 'fas'
        }
        return (
            <div className={sty['field-setting']}>
                {dropdown}
                <button
                    className={sty['btn-add']}
                    onClick={this.toggleDropdown}
                >
                    <i className={boldness + ' fa-fw fa-lg fa-cog'} />
                </button>
            </div>
        )
    }
}

export default FieldSettings