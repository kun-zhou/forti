import React from 'react'

import AddField from '../addField_addSection/addField.jsx'
import AddFieldSection from '../addField_addSection/AddFieldSection.jsx'
import Field from './fields/field.jsx'
import sty from './sty.cssm'
import SectionTitle from './sectionTitle.jsx'

export default class Section extends React.PureComponent {
    render() {
        var fields_jsx = this.props.section.get('field_order').map(
            (field_id) => <Field
                updateField={this.props.updateField}
                deleteField={this.props.deleteField}
                addField={this.props.addField}

                key={field_id}
                field_id={field_id}
                field={this.props.section.getIn(['fields', field_id])}
                sec_id={this.props.sec_id}
            />
        )

        return (< div className={sty['section']} >
            <SectionTitle
                toggleSecTitleEdit={this.props.updateSectionTitle}
                sec_id={this.props.sec_id}
                title={this.props.title}
            />
            {fields_jsx}
            {this.props.addSection
                ? <AddFieldSection
                    addField={this.props.addField}
                    addSection={this.props.addSection}
                    sec_id={this.props.sec_id}
                />
                : < AddField
                    addField={this.props.addField}
                    sec_id={this.props.sec_id}
                />
            }
        </div>)
    }
}
