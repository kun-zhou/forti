import React from 'react'
import Section from './section.jsx'
import sty from '../info.cssm'
export default class Sections extends React.PureComponent {
    render() {
        var last_section_idx = this.props.sections.size - 1
        var sections_jsx = this.props.sections.map((section, idx) => {
            if (idx === last_section_idx) { // if last section
                return (
                    <Section
                        key={idx}
                        sec_idx={idx}
                        title={section.get('title')}
                        fields={section.get('fields')}
                        updateField={this.props.updateField}
                        deleteField={this.props.deleteField}
                        addField={this.props.addField}
                        addSection={this.props.addSection}
                        updateSectionTitle={this.props.updateSectionTitle}
                    />
                )
            }
            return ( // if not
                <Section
                    key={idx}
                    sec_idx={idx}
                    title={section.get('title')}
                    fields={section.get('fields')}
                    updateField={this.props.updateField}
                    deleteField={this.props.deleteField}
                    addField={this.props.addField}
                    updateSectionTitle={this.props.updateSectionTitle}
                />
            )
        })
        return <div >{sections_jsx}</div>
    }
}