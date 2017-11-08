import React from 'react'
import sty from '../../sty.cssm'

class InputName extends React.PureComponent {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e) {
        if (!this.wrapperNode.contains(e.target)) {
            this.props.toggleNameEdit()
        }
    }

    componentDidMount() {
        /* add a listener to the wrapper component to make
         * any clicks outside of the wrapper component
         * execute `onHide` as passed from the props.
         */
        document.addEventListener('click', this.handleClick)
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick)
    }

    render() {
        return (
            <input
                className={sty['field-name-input']}
                type='text'
                value={this.props.local_name}
                placeholder={'field name'}
                onChange={this.props.editLocalName}
                ref={(e) => { this.wrapperNode = e; e ? e.focus() : {} }}
            />
        )
    }
}

class NameField extends React.PureComponent {
    render() {
        if (!this.props.name_editing) {
            return (
                <div
                    className={sty['field-name-display']}
                    onClick={this.props.toggleNameEdit}
                >
                    {this.props.local_name !== '' ? this.props.local_name : <span className={sty['div-placeholder']}>field name</span>}
                </div>
            )
        } else {
            return (
                <InputName {...this.props} />
            )
        }
    }
}

export default NameField