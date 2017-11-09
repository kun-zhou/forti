import React from 'react'
import Section from './section.jsx'
import sty from '../info.cssm'
export default class Sections extends React.PureComponent {
    render() {
        var last_section_idx = this.props.sections.length - 1
        var sections_jsx = this.props.sections.map((section, idx) => {
            if (idx === last_section_idx) { // if last section
                return (
                    <Section
                        sec_idx={idx}
                        title={section.title}
                        fields={section.fields}
                        updateField={this.props.updateField}
                        addSection={this.props.addSection}
                        editSectionHeader={this.props.editSectionHeader}
                    />
                )
            }
            return ( // if not
                <Section
                    sec_idx={idx}
                    title={section.title}
                    fields={section.fields}
                    updateField={this.props.updateField}
                    editSectionHeader={this.props.editSectionHeader}
                />
            )
        })
        return <div id={sty['content-wrapper']} >{sections_jsx}</div>
    }
}