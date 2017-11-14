import React from 'react'
import sty from './info.cssm'

import Title from './title/title.jsx'
import Tags from './tags/tagField.jsx'

import Toolbar from './toolbar/toolbar.jsx'
import AddField from './addField_addSection/addField.jsx'
import AddSecret from './addSecret.jsx'
import Sections from './key_value/sections.jsx'

import Dropup from '../../public/components/dropup/dropup.jsx'

class Info extends React.PureComponent {
    constructor(props) {
        super()
    }

    createSecret = (category) => {
        this.props.createSecret(category)
    }

    deleteSecret = () => {
        this.props.deleteSecret()
    }

    updateTitle = (content) => {
        this.props.updateMeta('UPDATE_TITLE', { key: 'title', new_value: content })
    }

    markFav = () => {
        this.props.updateMeta('UPDATE_FAV', { key: 'favorite', new_value: true })
    }

    unmarkFav = () => {
        this.props.updateMeta('UPDATE_FAV', { key: 'favorite', new_value: false })
    }

    addTag = (tag) => {
        this.props.updateMeta('ADD_TAG', { key: 'tags', new_value: tag })
    }

    deleteTag = (tag) => {
        this.props.updateMeta('DELETE_TAG', { key: 'tags', new_value: tag })
    }

    addSection = () => {
        this.props.updateCustom('ADD_SECTION')
    }

    updateSectionTitle = (sec_idx, new_value) => {
        this.props.updateCustom('UPDATE_SECTION_TITLE', { sec_idx, new_value })
    }

    updateField = (sec_idx, field_idx, content_idx, new_value) => {
        this.props.updateCustom('UPDATE_FIELD', { sec_idx, field_idx, content_idx, new_value })
    }

    deleteField = (sec_idx, field_idx) => {
        this.props.updateCustom('DELETE_FIELD', { sec_idx, field_idx })
    }

    addField = (sec_idx, field_idx) => {
        this.props.updateCustom('ADD_FIELD', { sec_idx })
    }


    render() {
        var addEntryDropup = <Dropup
            entries={this.props.categories}
            callback={this.props.createSecret}
        />

        var info = this.props.info

        if (!info) {
            return <div id={sty['info']}>
                {addEntryDropup}
            </div>
        }
        //<AddSecret categories={this.props.categories} createSecret={this.createSecret} />
        var id = info.get('id')

        return (
            <div id={sty['info']} key={id}>
                <Toolbar
                    markFav={this.markFav}
                    unmarkFav={this.unmarkFav}
                    deleteSecret={this.deleteSecret}

                    favorite={info.get('favorite')}
                />
                <Title
                    updateTitle={this.updateTitle}

                    title={info.get('title')}
                />
                <Tags
                    addTag={this.addTag}
                    deleteTag={this.deleteTag}

                    id={id}
                    tags={info.get('tags')}
                />
                <Sections
                    addSection={this.addSection}
                    updateSectionTitle={this.updateSectionTitle}
                    updateField={this.updateField}
                    deleteField={this.deleteField}
                    addField={this.addField}

                    sections={info.get('user_defined')}
                />
                {addEntryDropup}
            </div>
        )
    }
}

export default Info

/**
 *                 
 */