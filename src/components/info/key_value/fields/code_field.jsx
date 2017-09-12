import React from 'react'
import sty from '../sty.cssm'
import makeField from './field_hoc.jsx'


class CodeField extends React.Component {
    render() {
        // Name Field Rendering
        var name_field = !this.props.name_editing ?
            <div
                className={sty['field-name-display']}
                onClick={this.props.toggleNameEdit}
            >
                {this.props.local_name !== '' ? this.props.local_name : <span className={sty['div-placeholder']}>field name</span>}
            </div> :
            <input
                className={sty['field-name-input']}
                type='text'
                value={this.props.local_name}
                placeholder={'field name'}
                onChange={this.props.editLocalName}
                ref={(input) => { input ? input.focus() : {} }}
                onBlur={this.props.toggleNameEdit}
            />

        // Content Field Rendering
        var setting_icon = this.props.setting_shown ?
            <div className={sty['field-setting']}><i className='fal fa-cog fa-fw' /></div> :
            null
        var content_field = !this.props.content_editing ?
            <div
                className={sty['field-content-display']}
                onClick={this.props.toggleContentEdit}
                onMouseEnter={this.props.showSetting}
                onMouseLeave={this.props.hideSetting}
            >
                {
                    this.props.local_content !== '' ? // if content is not empty
                        Array(this.props.local_content.length + 1).join('#') : // code represented in pound signs (same length)
                        <span className={sty['div-placeholder']}>field content</span> // placeholder for nothing
                }
            </div> :
            <input
                className={sty['field-content-input']}
                value={this.props.local_content}
                placeholder={'field content'}
                onChange={this.props.editLocalContent}
                onBlur={this.props.toggleContentEdit}
                ref={(input) => { input ? input.focus() : {} }}
            />
        return (
            <div className={sty['field']}>
                <div className={sty['field-name']}>{name_field}</div>
                <div className={sty['field-content']}>{content_field}</div>
                {setting_icon}
            </div>
        )
    }
}

export default CodeField = makeField(CodeField)
