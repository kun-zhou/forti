import React from 'react'

import AddField from '../addField_addSection/addField.jsx'
import AddFieldSection from '../addField_addSection/AddFieldSection.jsx'
import Field from './fields/field.jsx'
import sty from './sty.cssm'
import sectionTitle from './sectionTitle.jsx'

export default class Section extends React.PureComponent {
    constructor(props) {
        super(props)
        // edit* is for local state updates, updated on each keystroke
        // toggle* update on field input status change and pushes the local data to redux store
    }

    updateField = (section_idx, field_idx, content_idx) => {
        this.props.udpateCustom(this.props.info.id, 'UPDATE_FIELD', { section_idx, field_idx, content_idx })
    }

    deleteField = (section_idx, field_idx) => {
        this.props.udpateCustom(this.props.info.id, 'DELETE_FIELD', { section_idx, field_idx })
    }

    addField = (section_idx, field_idx) => {
        this.props.udpateCustom(this.props.info.id, 'ADD_FIELD', { section_idx })
    }

    updateSectionTitle = (title) => {
        this.props.updateSectionTitle(this.props.sec_idx, title)
    }

    render() {
        var fields_jsx = this.props.fields.map(
            (field, idx) => {
                return (
                    <Field
                        key={idx}
                        field_idx={idx}
                        field={field}
                        updateField={this.updateField}
                        deleteField={this.deleteField}
                        addField={this.addField}
                    />
                )
            }
        )
        return (
            <div>
                <sectionTitle
                    title={this.props.title}
                    toggleSecTitleEdit={this.updateSectionTitle}
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