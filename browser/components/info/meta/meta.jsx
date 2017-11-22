import React from 'react'
import sty from './sty.cssm'
import Chip from 'material-ui/Chip';

class Tag extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = { delIsShown: false }
    }

    deleteTag = () => {
        this.props.deleteTag(this.props.name)
    }

    render() {
        return (
            <div className={sty['tag']}>
                {this.props.name}
                <div
                    className={[sty['tag-del'], 'fas', 'fa-fw', 'fa-times'].join(' ')}
                    onClick={this.deleteTag}
                />
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
                this.props.addTag(e.target.value)
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
                    deleteTag={this.props.deleteTag}
                />
            )
        )
        return (
            <div className={sty['tags-wrapper']}>
                {/* <span className={sty['meta-section-title']}>Tags</span> {ListTags} */}
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

class Meta extends React.PureComponent {
    render() {
        return (
            <div className={sty['section-meta']}>
                <Tags
                    addTag={this.props.addTag}
                    deleteTag={this.props.deleteTag}

                    tags={this.props.tags}
                />
            </div >
        )
    }
}
/*
<div className={sty['snippet']}>
    <span className={sty['meta-section-title']}>Snippet</span> {this.props.snippet}
</div>
*/

export default Meta