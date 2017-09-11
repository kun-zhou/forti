import React from 'react'
import sty from '../sty.cssm'
/**
 * HOC for various field components
 * `edit[A-Z]*` is for local state updates, updated on each keystroke
 * `toggle[A-Z]*` update on field input status change and pushes the local data to redux store
 */
export default makeField

function makeField(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                name_editing: false,
                content_editing: false,
                setting_editing: false,
                name: props.name,
                content: props.content,
                type: props.type
            }
            // edit* is for local state updates, updated on each keystroke
            // toggle* update on field input status change and pushes the local data to redux store
            this.editName = this.editName.bind(this)
            this.editContent = this.editContent.bind(this)

            this.toggleNameEdit = this.toggleNameEdit.bind(this)
            this.toggleContentEdit = this.toggleContentEdit.bind(this)
            this.toggleSettingEdit = this.toggleSettingEdit.bind(this)

            this.toggleTypeText = this.toggleTypeText.bind(this)
            this.toggleTypeCode = this.toggleTypeCode.bind(this)
            this.toggleTypeLink = this.toggleTypeLink.bind(this)
        }

        editName(e) { //name, content, type
            this.setState({ name: e.target.value })
        }

        editContent(e) {
            this.setState({ content: e.target.value })
        }

        toggleNameEdit(e) {
            if (e.target.tagName === 'INPUT') {
                this.props.editField(this.props.id, this.props.field_id, 'name', this.state.name)
            }
            this.setState({ name_editing: !this.state.name_editing })
        }

        toggleContentEdit(e) {
            if (e.target.tagName === 'INPUT') {
                this.props.editField(this.props.id, this.props.field_id, 'content', this.state.content)
            }
            this.setState({ content_editing: !this.state.content_editing })
        }

        toggleSettingEdit(e) {
            this.setState({ setting_editing: !this.state.setting_editing })
        }

        toggleTypeText(e) {
            // need to figure out how to get type
            this.props.editField(this.props.id, this.props.field_id, 'type', 'text')
        }

        toggleTypeCode(e) {
            // need to figure out how to get type
            this.props.editField(this.props.id, this.props.field_id, 'type', 'code')
        }

        toggleTypeLink(e) {
            // need to figure out how to get type
            this.props.editField(this.props.id, this.props.field_id, 'type', 'link')
        }

        render() {
            var passdownProps = {
                editName: this.editName,
                editContent: this.editContent,
                toggleNameEdit: this.toggleNameEdit,
                toggleContentEdit: this.toggleContentEdit,
                toggleSettingEdit: this.toggleSettingEdit,
                toggleTypeText: this.toggleTypeText,
                toggleTypeCode: this.toggleTypeCode,
                toggleTypeLink: this.toggleTypeLink
            }
            return <WrappedComponent {...Object.assign({}, passdownProps, this.state, this.props) } />
        }
    }
}