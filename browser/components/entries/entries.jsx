import React from 'react'
import sty from './entries.cssm'
import _ from 'lodash'
//import AddEntryDropdown from './addEntry.jsx'
import Input, { InputAdornment } from 'material-ui/Input';
import { List } from 'immutable'
import OutsideAlerter from '../public/outsideAlerter.jsx'

class Entry extends React.PureComponent {
    handleEntryClick = () => {
        this.props.entryClick(this.props.entry.get('id'), this.props.idx)
    }
    render() {
        var props = this.props
        var entryClassNames = [sty['entry']]
        // 1. Highlight
        if (props.activeEntry === props.entry.get('id')) {
            if (props.activePane === 'entries') {
                entryClassNames.push(sty['is-active'])
            } else {
                entryClassNames.push(sty['is-selected'])
            }
        }
        entryClassNames = entryClassNames.join(' ')

        // 2. Tags
        var tag_field = []
        for (let tag of props.entry.get('tags')) {
            tag_field.push(
                <span className={sty['tag']}><i className={['far', 'fa-hashtag'].join(' ')} />{tag}</span>
            )
        }

        // Render
        return (
            <div className={entryClassNames} onClick={this.handleEntryClick} >
                <div className={sty['entry-left']}>
                </div>
                <div className={sty['entry-main']}>
                    <div className={sty['entry-title']} >
                        <span className={sty['entry-title-icon']}><i className={'fal fa-fw ' + props.categories_config.get(props.entry.get('category'))} /> </span>
                        {props.entry.get('title') ? props.entry.get('title') : <span className={'placeholder'}>A wonderful new secret</span>}
                    </div>

                    <div className={sty['entry-tags']}>
                        {tag_field}
                    </div>
                </div>
            </div>
        )
    }
}

class Search extends React.PureComponent {
    constructor(props) {
        super()
        this.debouncedSearch = _.debounce(props.search, 600)
        this.state = {
            focused: false,
            search_string: ''
        }
    }

    handleChange = (e) => {
        var value = e.target.value
        this.setState({ search_string: value })
        if (value !== '') {
            this.debouncedSearch(value)
        } else {
            props.deactivateSearch()
        }
    }

    handleFocus = () => {
        this.setState({ focused: true })
    }

    handleBlur = () => { // not really blur
        if (this.state.search_string === '') {
            this.setState({ focused: false })
            this.setState({ search_string: '' })
            props.deactivateSearch()
        }
    }

    handleCancel = () => {
        console.log('cacelled')
        this.setState({ focused: false })
        this.setState({ search_string: '' })
        props.deactivateSearch()
    }

    render() {
        var cancelIconClassName = ['fal', 'fa-fw', 'fal', 'fa-search', 'fa-times-circle', sty['cancel-icon']]
        !this.state.focused ? cancelIconClassName.push('is-hidden') : {}
        return (
            <OutsideAlerter handleClickOutside={this.handleBlur} className={sty['search-wrapper']}>
                <i className={'far fa-search' + ' ' + sty['search-icon']} />
                <input
                    type='text'
                    value={this.state.search_string}
                    className={sty['search-input']}
                    placeholder='Search Secrets'
                    onFocus={this.handleFocus}
                    onChange={this.handleChange}
                />
                <i
                    className={cancelIconClassName.join(' ')}
                    onClick={this.handleCancel}
                />
            </OutsideAlerter>
        )
    }
}

const AbstractView = (props) => {
    //{ visibleEntries, activeEntry, activePane, entries, showAddEntry }
    var entries = props.activeEntries
    // handle the case if entries are none
    if (!entries || entries.size === 0) {
        return (<div id={sty['entries']} >
            <Search deactivateSearch={props.deactivateSearch} search={props.search} />
        </div>)
    }
    // 1. List of Entries
    var list = []
    var cachedAbstracts = props.cachedAbstracts

    entries.forEach((id, i) => {
        var entry = cachedAbstracts.get(id)
        list.push(<Entry
            key={entry.get('id')}
            entryClick={props.entryClick}
            activeEntry={props.activeEntry}
            activePane={props.activePane}
            categories_config={props.categories_config}
            entry={entry}
            idx={i}
        />)
    })

    return (
        <div id={sty['entries']} >
            <Search deactivateSearch={props.deactivateSearch} search={props.search} />
            <div className={sty['abstract-lists']}>
                <div className={sty['abstract-list']}>
                    <div className={sty['list-title-wrapper']}>
                        <span className={sty['list-title']}>{props.activeNavTab}</span>
                    </div>
                    {list}
                </div>
            </div>
        </div>
    )
}

export default AbstractView