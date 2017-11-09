import React from 'react'

import AddField from '../addField_addSection/addField.jsx'
import AddFieldSection from '../addField_addSection/AddFieldSection.jsx'
import Field from './fields/field.jsx'
import sty from './sty.cssm'
import SectionHeader from './sectionHeader.jsx'

export default class Section extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            title_editing: false,
            title: props.title,
        }
        // edit* is for local state updates, updated on each keystroke
        // toggle* update on field input status change and pushes the local data to redux store
    }

    updateField = (field_idx, content, operation) => {
        this.props.updateField(this.props.sec_idx, field_idx, content, operation)
    }

    addSection = () => {
        this.props.addSection(this.props.id, this.props.idx)
    }

    editLocalSecTitle = (e) => {
        this.setState({ title: e.target.value })
    }
    // let section title flow to redux state
    flowTitle = (e) => {
        if (e.target.tagName === 'INPUT') {
            if (this.props.title !== this.state.title) {
                this.props.editSectionHeader(this.props.id, this.props.idx, this.state.title)
            }
        }
        this.setState({ title_editing: !this.state.title_editing })
    }

    render() {
        var fields_jsx = this.props.fields.map(
            (field) => {
                return (
                    <Field
                        field={field}
                        updateField={this.updateField}
                    />
                )
            }
        )
        return (
            <div>
                <SectionHeader
                    title={this.state.title}
                    editing={this.state.title_editing}
                    editLocalSecTitle={this.editLocalSecTitle}
                    toggleSecTitleEdit={this.toggleSecTitleEdit}
                />
                {fields_jsx}
                {this.props.addSection ?
                    <AddFieldSection
                        addField={this.addField}
                        addSection={this.addSection}
                    /> :
                    <AddField
                        addField={this.addField}
                    />
                }
            </div>
        )
    }
}