import React from 'react'
import Section from './section.jsx'
import sty from '../info.cssm'

export default class Sections extends React.PureComponent {
    render() {
        var last_section_idx = this.props.sections.size - 1
        var sections_jsx = this.props.section_order.map((sec_id, idx) => {
            var section = this.props.sections.get(sec_id)
            // if last section
            if (idx === last_section_idx) {
                return (
                    <Section
                        key={sec_id}
                        sec_id={sec_id}
                        title={section.get('title')}
                        section={section}

                        updateField={this.props.updateField}
                        deleteField={this.props.deleteField}
                        addField={this.props.addField}
                        addSection={this.props.addSection}
                        updateSectionTitle={this.props.updateSectionTitle}
                    />
                )
            }
            // else
            return ( // if not
                <Section
                    key={sec_id}
                    sec_id={sec_id}
                    title={section.get('title')}
                    section={section}

                    updateField={this.props.updateField}
                    deleteField={this.props.deleteField}
                    addField={this.props.addField}
                    updateSectionTitle={this.props.updateSectionTitle}
                />
            )
        })
        return <div>{sections_jsx}</div>
    }
}