import React from 'react'
import sty from './sty.cssm'
import Chip from 'material-ui/Chip'
import Done from 'material-ui-icons/Done'

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
            <Chip
                classes={{ root: sty['tag'], label: sty['tag-label'], deleteIcon: sty['tag-del'] }}
                label={this.props.name}
                onRequestDelete={this.deleteTag}
            />
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
                    key={tag}
                />
            )
        )
        return (
            <div className={sty['tags-wrapper']}>
                {ListTags}
                <input
                    className={sty['tag-input']}
                    placeholder='add tag (press return after entering tag name)'
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