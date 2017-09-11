import React from 'react'
import TextField from './fields/text_field.jsx'
import CodeField from './fields/code_field.jsx'
import LinkField from './fields/link_field.jsx'
import NoteField from './fields/note_field.jsx'

import sty from './sty.cssm'
import SectionHeader from './sectionHeader.jsx'

class Section extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        var content = this.props.content
        var ListFields = this.props.fields.map(
            (field) => {
                var data = {
                    key: field,
                    id: this.props.id,
                    field_id: field,
                    name: content.getIn([field, 0]),
                    content: content.getIn([field, 1]),
                    type: content.getIn([field, 2]),
                    editField: this.props.editField
                }
                console.log(data.type)
                switch (data.type) {
                    case 'text':
                        return <TextField {...data} />
                    case 'code':
                        return <CodeField {...data} />
                    case 'link':
                        return <LinkField {...data} />
                    case 'note':
                        return <NoteField {...data} />
                }
            }
        )
        return (
            <div>
          
                {ListFields}
            </div>
        )
    }
}
export default Section