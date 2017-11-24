import React from 'react'
import sty from '../sty.cssm'
import NameField from './subfields_components/NameField.jsx'
import ContentField from './subfields_components/ContentField.jsx'
/**
 * HOC for various field components
 * `edit[A-Z]*` is for local state updates, updated on each keystroke
 * `toggle[A-Z]*` update on field input status change and pushes the local data to redux store
 */
class Field extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            name_editing: false,
            content_editing: false,
            setting_shown: false,
            local_name: props.field.get(0),
            local_content: props.field.get(1),
        }
        // edit* is for local state updates, updated on each keystroke
        // toggle* update on field input status change and pushes the local data to redux store
    }

    editLocalName = (e) => { //name, content, type
        this.setState({ local_name: e.target.value })
    }

    editLocalContent = (e) => {
        this.setState({ local_content: e.target.value })
    }

    toggleNameEdit = (e) => {
        if (this.state.name_editing && this.state.local_name !== this.props.field.get(0)) {
            this.props.updateField(this.props.sec_idx, this.props.field_idx, 0, this.state.local_name)
        }
        this.setState({ name_editing: !this.state.name_editing })
    }

    toggleContentEdit = (e) => {
        if (this.state.content_editing && this.state.local_content !== this.props.field.get(1)) {
            this.props.updateField(this.props.sec_idx, this.props.field_idx, 1, this.state.local_content)
        }
        this.setState({
            content_editing: !this.state.content_editing,
            setting_shown: !this.state.setting_shown
        })
    }

    toggleFieldType = (type) => {
        if (type !== this.props.field.get(2)) {
            this.props.updateField(this.props.sec_idx, this.props.field_idx, 2, type)
        }
    }

    delField = () => {
        this.props.deleteField(this.props.sec_idx, this.props.field_idx)

    }

    render() {
        var passdownProps = {
            editLocalName: this.editLocalName,
            editLocalContent: this.editLocalContent,
            toggleNameEdit: this.toggleNameEdit,
            toggleContentEdit: this.toggleContentEdit,
            delField: this.delField,
            toggleFieldType: this.toggleFieldType,

            type: this.props.field.get(2)
        }
        return (
            <div className={sty['field']}>
                <div className={sty['field-name']}>
                    <NameField {...Object.assign({}, this.state, passdownProps) } />
                </div>
                <div className={sty['field-content']}>
                    <ContentField {...Object.assign({}, this.state, passdownProps) } />
                </div>
            </div>
        )
    }
}

export default Field