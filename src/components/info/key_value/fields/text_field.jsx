import React from 'react'
import sty from '../sty.cssm'
import makeField from './field_hoc.jsx'


class TextField extends React.PureComponent {
    render() {
        // Name Field Rendering
        var name_field = !this.props.name_editing ?
            <div
                className={sty['field-name-display']}
                onClick={this.props.toggleNameEdit}
            >
                {this.props.name !== '' ? this.props.name : <span className={sty['div-placeholder']}>field name</span>}
            </div> :
            <input
                className={sty['field-name-input']}
                value={this.props.name}
                placeholder={'field name'}
                onChange={this.props.editName}
                ref={(input) => { input ? input.focus() : {} }}
                onBlur={this.props.toggleNameEdit}
            />

        // Content Field Rendering
        var setting_icon = this.props.setting_editing ?
            <div className={sty['field-setting']}><i className='fal fa-cog fa-fw' /></div> :
            null
        var content_field = !this.props.content_editing ?
            <div
                className={sty['field-content-display']}
                onClick={this.props.toggleContentEdit}
                onMouseEnter={this.props.toggleSetting}
                onMouseLeave={this.props.toggleSetting}
            >
                {
                    this.props.content !== '' ? // if content is not empty
                        this.props.content :
                        <span className={sty['div-placeholder']}>field content</span>
                }
            </div> :
            <input
                className={sty['field-content-input']}
                value={this.props.content}
                placeholder={'field content'}
                onChange={this.props.editContent}
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
export default TextField = makeField(TextField)
