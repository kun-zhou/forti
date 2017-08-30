import React from 'react'
import sty from './info.cssm'

import Title from './title.jsx'
import Tags from './tagField.jsx'
import Field from './field.jsx'
import Toolbar from './toolbar.jsx'
import AddField from './addField.jsx'
import Dropup from '../../public/components/dropup/dropup.jsx'
//import { BlockPicker } from 'react-color'

class Section extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        var content = this.props.content
        var ListFields = this.props.fields.map(
            (field) => (
                <Field
                    key={field}
                    id={this.props.id}
                    field_id={field}
                    name={content.getIn([field, 0])}
                    content={content.getIn([field, 1])}
                    type={content.getIn([field, 2])}
                    editField={this.props.editField}
                />
            )
        )
        return <div>{ListFields}</div>
        /* Version with section heading
        return (
            <div>
                <div className={sty['section-name']}>{this.props.name}</div>
                {ListFields}
            </div>
        )
        */
    }
}

class Info extends React.PureComponent {
    constructor(props) {
        super(props)
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
        var id = info.get('id')
        var ListSections = info.get('sections_order').map(
            (section) => (
                <Section
                    key={id + section}
                    name={section}
                    id={id}
                    fields={info.getIn(['sections', section])}
                    content={info.get('user_defined')}
                    editField={this.props.editField}
                />
            )
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
                    <AddField
                        addField={this.props.addField}
                        id={id} />
                </div>
                {addEntryDropup}
            </div>
        )
    }
}

export default Info