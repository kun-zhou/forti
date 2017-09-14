import React from 'react'
import sty from './sty.cssm'

class Tag extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = { delIsShown: false }
        this.deleteTag = this.deleteTag.bind(this)
        this.toggleDel = this.toggleDel.bind(this)
    }

    deleteTag() {
        this.props.delTag(this.props.name)
    }
    toggleDel() {
        this.setState({delIsShown: !this.state.delIsShown})
    }
    render() {
        return (
            <div
                className={sty['tag']}
                onMouseEnter={this.toggleDel}
                onMouseLeave={this.toggleDel}>
                {this.props.name}
                {this.state.delIsShown ?
                    <div
                        className={[sty['tag-del'], 'fas', 'fa-fw', 'fa-times'].join(' ')}
                        onClick={this.deleteTag}
                    /> :
                    null
                }
            </div>
        )
    }
}

class Tags extends React.PureComponent {
    constructor(props) {
        super(props)
        this.bindHotKey = this.bindHotKey.bind(this)
        this.unbindHotKey = this.unbindHotKey.bind(this)
    }

    bindHotKey(e) {
        e.persist()
        // ES6 arrow for lexical `this`
        e.target.onkeypress = (ev) => {
            if (ev.keyCode === 13) {
                this.props.addTag(this.props.id, e.target.value)
                e.target.value = ''
            }
        }
    }

    unbindHotKey(e) {
       delete e.target.onkeypress
    }

    render() {
        var ListTags = this.props.tags.map(
            (tag) => (
                <Tag
                    name={tag}
                    delTag={this.props.delTag}
                />
            )
        )
        return (
            <div className={sty['tags-wrapper']}>
                {ListTags}
                <input
                    className={sty['tag-input']}
                    placeholder='add tag'
                    onFocus={this.bindHotKey}
                    onBlur={this.unbindHotkey}
                />
            </div>
        )
    }
}

export default Tags