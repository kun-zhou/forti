import React from 'react'
import sty from '../sty.cssm'
import makeField from './field_hoc.jsx'
import InputContent from './subfields_components/InputContent.jsx'

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
                <input
                    className={sty['field-name-input']}
                    type='text'
                    value={this.props.local_name}
                    placeholder={'field name'}
                    onChange={this.props.editLocalName}
                    onBlur={this.props.toggleNameEdit}
                    ref={(e) => e ? e.focus() : {}}
                />
            )
        }
    }
}

class ContentField extends React.PureComponent {
    render() {
        if (!this.props.content_editing) {
            return (
                <div
                    className={sty['field-content-display']}
                    onClick={this.props.toggleContentEdit}
                >
                    {
                        this.props.local_content !== '' ? // if content is not empty
                            this.props.local_content :
                            <span className={sty['div-placeholder']}>field content</span>
                    }
                </div>
            )
        } else {
            return <InputContent {...this.props} />
        }
    }
}

export default makeField(NameField, ContentField)