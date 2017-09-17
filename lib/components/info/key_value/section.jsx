import React from 'react'

import AddField from '../addField_addSection/addField.jsx'
import AddFieldSection from '../addField_addSection/AddFieldSection.jsx'
/*
    import TextField from './fields/text_field.jsx'
    import CodeField from './fields/code_field.jsx'
    import LinkField from './fields/link_field.jsx'
*/
import NoteField from './fields/note_field.jsx'

import sty from './sty.cssm'
import SectionHeader from './sectionHeader.jsx'

class Section extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            sec_name_editing: false,
            sec_name: props.sec_name,
        }

        // edit* is for local state updates, updated on each keystroke
        // toggle* update on field input status change and pushes the local data to redux store
        this.addField = this.addField.bind(this)
        this.addSection = this.addSection.bind(this)
        this.editLocalSecTitle = this.editLocalSecTitle.bind(this)
        this.toggleSecTitleEdit = this.toggleSecTitleEdit.bind(this)
    }

    addField() {
        this.props.addField(this.props.id, this.props.idx, 'text')
    }

    addSection() {
        this.props.addSection(this.props.id, this.props.idx)
    }

    editLocalSecTitle(e) {
        this.setState({ sec_name: e.target.value })
    }

    toggleSecTitleEdit(e) {
        if (e.target.tagName === 'INPUT') {
            if (this.props.sec_name !== this.state.sec_name) {
                this.props.editSectionHeader(this.props.id, this.props.idx, this.state.sec_name)
            }
        }
        this.setState({ sec_name_editing: !this.state.sec_name_editing })
    }

    render() {
        var content = this.props.content
        var ListFields = this.props.fields.map(
            (field, idx) => {
                var data = {
                    key: field,
                    id: this.props.id,
                    field_id: field,
                    name: content.getIn([field, 0]),
                    section: this.props.sec_name,
                    content: content.getIn([field, 1]),
                    type: content.getIn([field, 2]),
                    editField: this.props.editField,
                    delField: this.props.delField,
                }
                /*
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
                */
                return <NoteField {...data} />
            }
        )
        if (this.props.lastSection) {
            return (
                <div>
                    <SectionHeader
                        sec_name={this.state.sec_name}
                        editing={this.state.sec_name_editing}
                        editLocalSecTitle={this.editLocalSecTitle}
                        toggleSecTitleEdit={this.toggleSecTitleEdit}
                    />
                    {ListFields}
                    <AddFieldSection
                        addField={this.addField}
                        addSection={this.addSection}
                    />
                </div>
            )
        }
        return (
            <div>
                <SectionHeader
                    sec_name={this.state.sec_name}
                    editing={this.state.sec_name_editing}
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