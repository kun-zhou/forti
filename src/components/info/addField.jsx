import React from 'react'
import sty from './info.cssm'
class Dropdown extends React.PureComponent {
    
}

class AddField extends React.PureComponent {
    constructor(props) {
        super(props)
        this.addField = this.addField.bind(this)
    }

    addField(e) {
        this.props.addField(this.props.id, 'Basic Info', 'text')
    }

    render() {
        return (
            <div className={sty['add-field']}>
                <div
                    className={sty['btn-add-field']}
                    onClick={this.addField}
                >+ Field</div>
            </div>
        )
    }
}
export default AddField