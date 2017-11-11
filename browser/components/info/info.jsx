import React from 'react'
import sty from './info.cssm'

import Title from './title/title.jsx'
import Tags from './tags/tagField.jsx'

import Toolbar from './toolbar/toolbar.jsx'
import AddField from './addField_addSection/addField.jsx'
import AddSecret from './addSecret.jsx'
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
        this.props.updateMeta(this.props.info.id, 'title', content)
    }

    addSection = () => {
        this.props.udpateCustom(this.props.info.id, 'ADD_SECTION')
    }

    updateSectionTitle = (sec_idx, new_value) => {
        this.props.udpateCustom(this.props.info.id, 'UPDATE_SECTION_TITLE', { sec_idx, new_value })
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
        var info = this.props.info
        if (!info) {
            return <div id={sty['info']}><AddSecret categories={this.props.categories} createSecret={this.createSecret} /></div>
        }
        var id = info.id

        return (
            <div id={sty['info']} key={id}>
                <Toolbar
                    id={id}
                    favorite={info.get('favorite')}
                    updateFav={this.updateFav}
                    deleteSecret={this.deleteSecret}
                />
                <Title
                    id={id}
                    title={info.get('title')}
                    updateTitle={this.updateTitle}
                />

                <Sections
                    sections={info.get('user_defined')}
                    addSection={this.addSection}
                    updateSectionTitle={this.updateSectionTitle}
                    updateField={this.updateField}
                    deleteField={this.deleteField}
                    addField={this.addField}
                />
                <AddSecret categories={this.props.categories} createSecret={this.createSecret} />
            </div>
        )
    }
}

export default Info

/**
 *                 <Tags
                    id={id}
                    tags={info.get('tags')}
                    addTag={this.addTag}
                    delTag={this.deleteTag}
                />
 */