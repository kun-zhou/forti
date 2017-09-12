import React from 'react'

import AddField from '../addField_addSection/addField.jsx'
import TextField from './fields/text_field.jsx'
import CodeField from './fields/code_field.jsx'
import LinkField from './fields/link_field.jsx'
import NoteField from './fields/note_field.jsx'

import sty from './sty.cssm'
import SectionHeader from './sectionHeader.jsx'

class Section extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            name_editing: false,
            name: props.name,
        }

        // edit* is for local state updates, updated on each keystroke
        // toggle* update on field input status change and pushes the local data to redux store
        this.addField = this.addField.bind(this)
        this.editLocalSecTitle = this.editLocalSecTitle.bind(this)
        this.toggleSecTitleEdit = this.toggleSecTitleEdit.bind(this)
    }

    addField() {
        this.props.addField(this.props.id, this.props.name, 'text')
    }

    editLocalSecTitle(e) {
        this.setState({ name: e.target.value })
    }

    toggleSecTitleEdit(e) {
        if (e.target.tagName === 'INPUT') {
            if (this.props.name !== this.state.name) {
                this.props.editSectionHeader(this.props.id, this.props.name, this.state.name)
            }
        }
        this.setState({ name_editing: !this.state.name_editing })
    }

    render() {
        var content = this.props.content
        var ListFields = this.props.fields.map(
            (field) => {
                var data = {
                    key: field,
                    id: this.props.id,
                    field_id: field,
                    name: content.getIn([field, 0]),
                    content: content.getIn([field, 1]),
                    type: content.getIn([field, 2]),
                    editField: this.props.editField
                }

                switch (data.type) {
                    case 'text':
                        return <TextField {...data} />
                    case 'code':
                        return <CodeField {...data} />
                    case 'link':
                        return <LinkField {...data} />
                    case 'note':
                        return <NoteField {...data} />
                }
            }
        )
        return (
            <div>
                <SectionHeader
                    name={this.state.name}
                    editing={this.state.name_editing}
                    editLocalSecTitle={this.editLocalSecTitle}
                    toggleSecTitleEdit={this.toggleSecTitleEdit}
                />
                {ListFields}
                <AddField
                    addField={this.addField}
                />
            </div>
        )
    }
}

export default Section