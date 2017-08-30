import React from 'react'
import sty from './info.cssm'

class Title extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            title_editing: false,
            title: props.title
        }
        this.toggleTitleEdit = this.toggleTitleEdit.bind(this)
        this.editTitle = this.editTitle.bind(this)
    }

    editTitle(e) {
        this.setState({ title: e.target.value })
    }

    toggleTitleEdit() {
        this.props.editTitle(this.props.id, this.state.title)
        this.setState({ title_editing: !this.state.title_editing })
    }

    render() {
        if (!this.state.title_editing) return (
            <div id={sty['title-wrapper']}>
                <div id={sty['title-content-display']} onClick={this.toggleTitleEdit}>
                    {this.state.title}
                </div>
            </div>
        )
        return (
            <div id={sty['title-wrapper']}>
                <input id={sty['title-content-input']} onBlur={this.toggleTitleEdit} onChange={this.editTitle} value={this.state.title} ref={(input) => { input ? input.focus() : {} }} />
            </div>
        )
    }
}
export default Title