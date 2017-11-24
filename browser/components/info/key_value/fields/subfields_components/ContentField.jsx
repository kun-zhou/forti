/**
 * This file should eventually read community defiend content field for display.
 */
const { clipboard } = require('electron')
import React from 'react'
import sty from '../../sty.cssm'
import TypeSwitcher from './TypeSwitcher.jsx'
import { toCode, toLink } from './defaultContentDisplay'
import OutsideAlerter from '../../../../public/outsideAlerter.jsx'
import Textarea from "react-textarea-autosize";

class ContentField extends React.PureComponent {
    constructor() {
        super()
        this.state = { toolbar_shown: false, toolbar_stick: false }
        this.showToolbar = this.showToolbar.bind(this)
        this.hideToolbar = this.hideToolbar.bind(this)
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.content_editing) {
            this.setState({ toolbar_shown: false })
        }
    }

    handlePaste = e => {
        e.stopPropagation()
        clipboard.writeText(this.props.local_content)
    }

    showToolbar() {
        this.setState({ toolbar_shown: true })
    }

    hideToolbar() {
        this.setState({ toolbar_shown: false })
    }

    handleTypeSwitcherClick = () => {
        this.setState({ toolbar_stick: !this.state.toolbar_stick })
    }

    render() {
        if (!this.props.content_editing) {
            var displayValue = this.props.local_content
            switch (this.props.type) {
                case 'code':
                    displayValue = toCode(displayValue); break
                case 'link':
                    displayValue = toLink(displayValue); break
                case 'note':
                    displayValue = <p>{displayValue}</p>; break;
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
                    {/* Content */}
                    {
                        this.props.local_content !== '' ? // if content is not empty
                            displayValue :
                            <span className={'placeholder'}>field content</span>
                    }
                    {/* Toolbar */}
                    <div className={this.state.toolbar_stick || this.state.toolbar_shown ? sty['field-content-display-btns'] : 'is-hidden ' + sty['field-content-display-btns']} >
                        <i className='fal fa-fw fa-clipboard' onClick={this.handlePaste} />
                        <TypeSwitcher {...this.props} onClick={this.handleTypeSwitcherClick} />
                    </div>
                </div>
            )
        } else {
            if (this.props.type === 'note') {
                return (
                    <OutsideAlerter handleClickOutside={this.props.toggleContentEdit} bindOnMount={true}>
                        <Textarea
                            onChange={this.props.editLocalContent}
                            inputRef={(node) => { node ? node.focus() : {} }}

                            className={sty['field-content-input']}
                            style={{ 'margin-bottom': '-3px' }}
                            value={this.props.local_content}
                            minRows={1}
                            maxRows={6}
                        />
                    </OutsideAlerter>
                )
            }
            return (
                <OutsideAlerter handleClickOutside={this.props.toggleContentEdit} bindOnMount={true}>
                    <input
                        onChange={this.props.editLocalContent}
                        ref={(e) => e ? e.focus() : {}}

                        className={sty['field-content-input']}
                        value={this.props.local_content}
                        placeholder={'field content'}
                    />
                </OutsideAlerter>
            )
        }
    }
}
//         <Textarea className={sty['field-content-input']} minRows={2} maxRows={6} />
export default ContentField