import React from 'react'
import sty from './sty.cssm'
import AutosizeInput from './AutosizeInput.jsx'
class SectionTitle extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            title_editing: false,
            title: props.title
        }
        this.editLocalSecTitle = this
            .editLocalSecTitle
            .bind(this)
        this.toggleSecTitleEdit = this
            .toggleSecTitleEdit
            .bind(this)
    }

    editLocalSecTitle(e) {
        this.setState({title: e.target.value})
    }

    toggleSecTitleEdit(e) {
        if (e.target.tagName === 'INPUT') {
            if (this.props.title !== this.state.title) {
                this
                    .props
                    .toggleSecTitleEdit(this.props.sec_idx, this.state.title)
            }
        }
        this.setState({
            title_editing: !this.state.title_editing
        })
    }

    render() {
        return (
            <div className={sty['section-name-wrapper']}>
                <AutosizeInput
                    inputClassName={sty['section-name']}
                    minWidth={'10px'}
                    value={this.state.title}
                    placeholder={'untitled section'}
                    onChange={this.editLocalSecTitle}
                    onBlur={this.toggleSecTitleEdit}/>
            </div>
        )
    }
}

export default SectionTitle