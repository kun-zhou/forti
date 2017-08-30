import React from 'react'
import sty from './info.cssm'
class Field extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            name_editing: false,
            content_editing: false,
            name: props.name,
            content: props.content
        }
        this.editName = this.editName.bind(this)
        this.editContent = this.editContent.bind(this)
        this.toggleNameEdit = this.toggleNameEdit.bind(this)
        this.toggleContentEdit = this.toggleContentEdit.bind(this)
    }

    toggleNameEdit(e) {

        this.setState({ name_editing: !this.state.name_editing })
        if (e.target.tagName === 'INPUT') {
            this.props.editField(this.props.id, this.props.field_id, 'name', this.state.name)
        }
    }

    toggleContentEdit(e) {
        if (e.target.tagName === 'INPUT') {
            this.props.editField(this.props.id, this.props.field_id, 'content', this.state.content)
        }
        this.setState({ content_editing: !this.state.content_editing })
    }

    editName(e) { //name, content, type
        this.setState({ name: e.target.value })
    }

    editContent(e) {
        this.setState({ content: e.target.value })
    }

    render() {
        var content_type = 'text'
        var name_field = !this.state.name_editing ?
            <div
                className={sty['field-name-display']}
                onClick={this.toggleNameEdit}
            >
                {this.state.name !== '' ? this.state.name : <span className={sty['div-placeholder']}>field name</span>}
            </div> :
            <input
                className={sty['field-name-input']}
                type='text'
                value={this.state.name}
                placeholder={'field name'}
                onChange={this.editName}
                ref={(input) => { input ? input.focus() : {} }}
                onBlur={this.toggleNameEdit}
            />
        var content_field = !this.state.content_editing ?
            <div
                className={sty['field-content-display']}
                onClick={this.toggleContentEdit}
            >
                {this.state.content !== '' ? this.state.content : <span className={sty['div-placeholder']}>field content</span>}
            </div> :
            <input
                className={sty['field-content-input']}
                type={content_type}
                value={this.state.content}
                placeholder={'field content'}
                onChange={this.editContent}
                onBlur={this.toggleContentEdit}
                ref={(input) => { input ? input.focus() : {} }}
            />

        return (
            <div className={sty['field']}>
                <div className={sty['field-name']}>{name_field}</div>
                <div className={sty['field-content']}>{content_field}</div>
            </div>
        )
    }
}
export default Field