import React from 'react'
import sty from './sty.cssm'

export default SectionHeader

class SectionHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editing: false,
            sec_title: props.sec_title,
        }
        // edit* is for local state updates, updated on each keystroke
        // toggle* update on field input status change and pushes the local data to redux store
        this.editSecTitle = this.editSecTitle.bind(this)
        this.toggleSecTitleEdit = this.toggleSecTitleEdit.bind(this)
    }

    editSecTitle(e) {
        this.setState({ sec_title: e.target.value })
    }

    toggleSecTitleEdit(e) {
        if (e.target.tagName === 'INPUT') {
            this.props.editField(this.props.id, this.props.field_id, 'sec_title', this.state.sec_title)
        }
        this.setState({ sec_title_editing: !this.state.sec_title_editing })
    }

    render() {
        return !this.state.editing ?
            <div
                className={sty['section-name']}
                onClick={this.toggleSecTitleEdit}
            >
                {
                    this.props.sec_title !== '' ? // if sec_title is not empty
                        this.props.sec_title :
                        <span className={sty['div-placeholder']}>field sec_title</span>
                }
            </div> :
            <input
                className={sty['section-name']}
                type={sec_title_type}
                value={this.props.sec_title}
                placeholder={'field sec_title'}
                onChange={this.editSecTitle}
                onBlur={this.toggleSecTitleEdit}
                ref={(input) => { input ? input.focus() : {} }}
            />
    }
}
