import React from 'react'
import sty from './info.cssm'

import Title from './title/title.jsx'
import Tags from './tags/tagField.jsx'

import Toolbar from './toolbar/toolbar.jsx'
import AddField from './addField_addSection/addField.jsx'
import Dropup from '../../public/components/dropup/dropup.jsx'
import Section from './key_value/section.jsx'


class Info extends React.PureComponent {
    render() {
        var addEntryDropup = <Dropup
            entries={this.props.entries}
            callback={this.props.createEmptyEntry}
        />

        var info = this.props.info
        if (!info) {
            return <div id={sty['info']}>{addEntryDropup}</div>
        }
        var id = info.get('id')
        var ListSections = info.get('sections').map(
            (section, idx) => {
                var lastSection = idx === (info.get('sections').size - 1)
                return (
                    <Section
                        sec_name={section.get('name')}
                        id={id}
                        idx={idx}
                        fields={section.get('fields')}
                        content={info.get('user_defined')}
                        editField={this.props.editField}
                        delField={this.props.delField}
                        addField={this.props.addField}
                        addSection={this.props.addSection}
                        editSectionHeader={this.props.editSectionHeader}
                        lastSection={lastSection}
                    />
                )
            }
        )
        return (
            <div id={sty['info']}  >
                <Toolbar
                    id={id}
                    favorite={info.get('favorite')}
                    markFav={this.props.markFav}
                    unmarkFav={this.props.unmarkFav}
                    deleteEntry={this.props.deleteEntry}
                />
                <Title
                    key={id}
                    id={id}
                    editTitle={this.props.editTitle}
                    title={info.get('title')}
                />
                <Tags
                    id={id}
                    tags={info.get('tags')}
                    addTag={this.props.addTag}
                    delTag={this.props.delTag}
                />
                <div id={sty['content-wrapper']}>
                    {ListSections}
                </div>
                {addEntryDropup}
            </div>
        )
    }
}

export default Info