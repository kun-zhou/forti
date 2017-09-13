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

function Dropdown({ entries_callbacks }) {
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
    }

    toggleDropdown(e) {
        e.nativeEvent.stopImmediatePropagation()
        this.setState({ dropdown_shown: !this.state.dropdown_shown })
    }

    render() {
        var entries_callbacks = [
            ['delete', this.props.delField],
            ['to text', this.props.toggleTypeText],
            ['to code', this.props.toggleTypeCode],
            ['to link', this.props.toggleTypeLink],
            ['to note', this.props.toggleTypeNote],
        ]
        if (this.state.dropdown_shown)
            return (
                <div className={sty['field-setting']}>
                    <AutohideDropdown
                        onHide={this.toggleDropdown}
                        entries_callbacks={entries_callbacks}
                    />
                    <button
                        className={sty['btn-add']}
                        onClick={this.toggleDropdown}
                    >
                        <i className='fas fa-fw fa-lg fa-cog' />
                    </button>
                </div>)
        return (
            <div className={sty['field-setting']}>
                <button
                    className={sty['btn-add']}
                    onClick={this.toggleDropdown}
                >
                    <i className='fal fa-fw fa-lg fa-cog' />
                </button>
            </div>
        )
    }
}

export default FieldSettings