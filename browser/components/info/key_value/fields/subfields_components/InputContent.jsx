import React from 'react'
import FieldSettings from './FieldSettings.jsx'
import sty from '../../sty.cssm'

class InputContent extends React.PureComponent {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e) {
        if (!this.wrapperNode.contains(e.target)) {
            this.props.toggleContentEdit()
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
            <div ref={(i) => { this.wrapperNode = i }} style={{position: 'relative'}}>
                <input
                    className={sty['field-content-input']}
                    value={this.props.local_content}
                    placeholder={'content'}
                    onChange={this.props.editLocalContent}
                    ref={(e) => e ? e.focus() : {}}
                />
                <FieldSettings {...this.props} />
            </div>
        )
    }
}

export default InputContent