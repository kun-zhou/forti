import React from 'react'

import AddField from '../addField_addSection/addField.jsx'
import AddFieldSection from '../addField_addSection/AddFieldSection.jsx'
import Field from './fields/field.jsx'
import sty from './sty.cssm'
import SectionTitle from './sectionTitle.jsx'

export default class Section extends React.PureComponent {
    constructor(props) {
        super(props)
        // edit* is for local state updates, updated on each keystroke
        // toggle* update on field input status change and pushes the local data to redux store
    }

    render() {
        var fields_jsx = this.props.fields.map(
            (field, idx) => {
                return (
                    <Field
                        field={field}
                        updateField={this.props.updateField}
                        deleteField={this.props.deleteField}
                        addField={this.props.addField}

                        key={idx}
                        sec_idx={this.props.sec_idx}
                        field_idx={idx}
                    />
                )
            }
        )
        return (
            <div className={sty['section']}>
                <SectionTitle
                    toggleSecTitleEdit={this.props.updateSectionTitle}

                    sec_idx={this.props.sec_idx}
                    title={this.props.title}
                />
                {fields_jsx}
                {this.props.addSection ?
                    <AddFieldSection
                        addField={this.props.addField}
                        addSection={this.props.addSection}

                        sec_idx={this.props.sec_idx}
                    /> :
                    <AddField
                        addField={this.props.addField}

                        sec_idx={this.props.sec_idx}
                    />
                }
            </div>
        )
    }
}