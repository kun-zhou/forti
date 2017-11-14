/**
 * This file should eventually read community defiend content field for display.
 */
const { clipboard } = require('electron')
import React from 'react'
import sty from '../../sty.cssm'
import FieldSettings from './FieldSettings.jsx'
import { toCode, toLink } from './defaultContentDisplay'
import OutsideAlerter from '../../../../public/outsideAlerter.jsx'


class ContentToolbar extends React.PureComponent {
    render() {
        return (
            <div className={sty['field-content-display-btns']}>
                <i className='far fa-clipboard' onClick={this.props.pasteToSysClipboard} />
            </div>
        )
    }
}

class ContentField extends React.PureComponent {
    constructor() {
        super()
        this.state = { toolbar_shown: false }
        this.pasteToSysClipboard = this.pasteToSysClipboard.bind(this)
        this.showToolbar = this.showToolbar.bind(this)
        this.hideToolbar = this.hideToolbar.bind(this)
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.content_editing) {
            this.setState({ toolbar_shown: false })
        }
    }

    pasteToSysClipboard(e) {
        e.stopPropagation()
        clipboard.writeText(this.props.local_content)
    }

    showToolbar() {
        this.setState({ toolbar_shown: true })
    }

    hideToolbar() {
        this.setState({ toolbar_shown: false })
    }

    render() {
        if (!this.props.content_editing) {
            var displayValue = this.props.local_content
            switch (this.props.type) {
                case 'code':
                    displayValue = toCode(displayValue); break
                case 'link':
                    displayValue = toLink(displayValue); break
                default:
                    displayValue = <p>{displayValue}</p>
            }
            return (
                <div
                    className={sty['field-content-display']}
                    onClick={this.props.toggleContentEdit}
                    onMouseEnter={this.showToolbar}
                    onMouseLeave={this.hideToolbar}
                >
                    {
                        this.props.local_content !== '' ? // if content is not empty
                            displayValue :
                            <span className={sty['div-placeholder']}>field content</span>
                    }
                    { // show toolbar on hover
                        this.state.toolbar_shown ? <ContentToolbar pasteToSysClipboard={this.pasteToSysClipboard} /> : null
                    }
                </div>
            )
        } else {
            return (
                <OutsideAlerter handleClickOutside={this.props.toggleContentEdit} bindOnMount={true}>
                    <input
                        className={sty['field-content-input']}
                        value={this.props.local_content}
                        placeholder={'field content'}
                        onChange={this.props.editLocalContent}
                        ref={(e) => e ? e.focus() : {}}
                    />
                    <FieldSettings {...this.props} />
                </OutsideAlerter>
            )
        }
    }
}

export default ContentField