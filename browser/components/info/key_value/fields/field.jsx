import React from 'react'
import sty from '../sty.cssm'
import NameField from './subfields_components/NameField.jsx'
import ContentField from './subfields_components/ContentField.jsx'
/**
 * HOC for various field components
 * `edit[A-Z]*` is for local state updates, updated on each keystroke
 * `toggle[A-Z]*` update on field input status change and pushes the local data to redux store
 */
class Field extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name_editing: false,
            content_editing: false,
            setting_shown: false,
            local_name: props.field.get(0),
            local_content: props.field.get(1),
            type: props.field.get(2)
        }
        // edit* is for local state updates, updated on each keystroke
        // toggle* update on field input status change and pushes the local data to redux store
        this.editLocalName = this.editLocalName.bind(this)
        this.editLocalContent = this.editLocalContent.bind(this)

        this.toggleNameEdit = this.toggleNameEdit.bind(this)
        this.toggleContentEdit = this.toggleContentEdit.bind(this)
        this.delField = this.delField.bind(this)
    }

    editLocalName(e) { //name, content, type
        this.setState({ local_name: e.target.value })
    }

    editLocalContent(e) {
        this.setState({ local_content: e.target.value })
    }

    toggleNameEdit(e) {
        if (this.state.name_editing) {
            this.props.updateField(this.props.field_idx, 0, this.state.local_name)
        }
        this.setState({ name_editing: !this.state.name_editing })
    }

    toggleContentEdit(e) {
        if (this.state.content_editing) {
            this.props.updateField(this.props.field_idx, 1, this.state.local_name)
        }
        this.setState({
            content_editing: !this.state.content_editing,
            setting_shown: !this.state.setting_shown
        })
    }

    delField() {
        this.props.deleteField(this.props.field_idx)
    }

    render() {
        var passdownProps = {
            editLocalName: this.editLocalName,
            editLocalContent: this.editLocalContent,
            toggleNameEdit: this.toggleNameEdit,
            toggleContentEdit: this.toggleContentEdit,
            delField: this.delField,
            toggleTypeText: this.toggleTypeText,
        }
        return (
            <div className={sty['field']}>
                <div className={sty['field-name']}>
                    <NameField {...Object.assign({}, this.state, passdownProps) } />
                </div>
                <div className={sty['field-content']}>
                    <ContentField {...Object.assign({}, this.props, this.state, passdownProps) } />
                </div>
            </div>
        )
    }
}

export default Field