import React from 'react'
import sty from './info.cssm'

import Title from './title/title.jsx'
import Tags from './tags/tagField.jsx'

import Toolbar from './toolbar/toolbar.jsx'
import AddField from './addField_addSection/addField.jsx'
import Dropup from '../../public/components/dropup/dropup.jsx'
import Sections from './key_value/sections.jsx'


import { debounce } from 'lodash'

class Info extends React.PureComponent {
    constructor() {
        super()
    }

    createSecret = (category) => {
        this.props.createSecret(category)
    }

    deleteSecret = () => {
        this.props.deleteSecret(this.props.info.id)
    }

    updateTitle = (content) => {
        this.props.updateTitle(this.props.info.id, content)
    }

    addSection = () => {
        this.props.addSection(this.props.info.id)
    }

    updateSectionTitle = (title) => {
        this.props.updateSectionTitle(this.props.info.id, idx, title)
    }

    updateField = (section_idx, field_idx, content, operation) => {
        this.props.updateField(this.props.info.id, section_idx, field_idx, content, operation)
    }

    updateFav = (operation) => { //operation can be add 1 or edit 0 or del -1
        this.props.updateFav(this.props.info.id, operation)
    }

    addTag = (tag) => {
        this.props.addTag(this.props.info.id, tag)
    }

    deleteTag = (tag) => {
        this.props.deleteTag(this.props.info.id, tag)
    }

    render() {
        var addEntryDropup = <Dropup
            entries={this.props.entries}
            callback={this.props.createEmptyEntry}
        />

        var info = this.props.info
        if (!info) {
            return <div id={sty['info']}>{addEntryDropup}</div>
        }
        var id = info.id

        return (
            <div id={sty['info']} key={id}>
                <Toolbar
                    id={id}
                    favorite={info.favorite}
                    updateFav={this.updateFav}
                    deleteSecret={this.deleteSecret}
                />
                <Title
                    id={id}
                    title={info.title}
                    updateTitle={this.updateTitle}
                />
                <Tags
                    id={id}
                    tags={info.tags}
                    addTag={this.addTag}
                    delTag={this.deleteTag}
                />
                <Sections
                    sections={this.props.info.user_defined}
                    addSection={this.props.addSection}
                    updateField={this.props.updateField}
                />
                {addEntryDropup}
            </div>
        )
    }
}

export default Info