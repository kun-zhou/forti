import React from 'react'
import sty from './entries.cssm'
import _ from 'lodash'
//import AddEntryDropdown from './addEntry.jsx'
import Input, { InputAdornment } from 'material-ui/Input';
import { List } from 'immutable'
import OutsideAlerter from '../public/outsideAlerter.jsx'

class Entry extends React.Component {
    handleEntryClick = () => {
        this.props.entryClick(this.props.entry.get('id'))
    }
    render() {
        var entryClassNames = [sty['entry']]
        // 1. Highlight
        if (this.props.activeEntry === this.props.entry.get('id')) {
            if (this.props.activePane === 'entries') {
                entryClassNames.push(sty['is-active'])
            } else {
                entryClassNames.push(sty['is-selected'])
            }
        }
        entryClassNames = entryClassNames.join(' ')

        // 2. Tags
        var tag_field = []
        for (let tag of this.props.entry.get('tags')) {
            tag_field.push(
                <span className={sty['tag']}><i className={['far', 'fa-hashtag'].join(' ')} />{tag}</span>
            )
        }
        /**<div className={sty['tag']} style={{ 'backgroundColor': this.props.tag_colors.get(tag) }}>
                    {tag}
            </div>*/
        // Render
        return (
            <div className={entryClassNames} onClick={this.handleEntryClick} >
                <div className={sty['entry-left']}>
                </div>
                <div className={sty['entry-main']}>
                    <div className={sty['entry-title']} >
                        <span className={sty['entry-title-icon']}><i className={'fal fa-fw ' + this.props.category_icons.get(this.props.entry.get('category'))} /> </span>
                        {this.props.entry.get('title')}
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
            this.props.deactivateSearch()
        }
    }

    handleFocus = () => {
        this.setState({ focused: true })
    }

    handleBlur = () => { // not really blur
        if (this.state.search_string === '') {
            this.setState({ focused: false })
            this.setState({ search_string: '' })
            this.props.deactivateSearch()
        }
    }

    handleCancel = () => {
        console.log('cacelled')
        this.setState({ focused: false })
        this.setState({ search_string: '' })
        this.props.deactivateSearch()
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


class AbstractList extends React.PureComponent {
    render() {
        // 1. List of Entries
        var ListEntries =
            this.props.list.map((abstract) => {
                return <Entry
                    key={abstract.get('id')}
                    entryClick={this.props.entryClick}
                    activeEntry={this.props.activeEntry}
                    activePane={this.props.activePane}
                    tag_colors={this.props.tag_colors}
                    category_icons={this.props.category_icons}
                    entry={abstract}
                />
            })
        return (
            <div className={sty['abstract-list']}>
                <div className={sty['list-title-wrapper']}>
                    <span className={sty['list-title']}>
                        {this.props.title}
                    </span>
                </div>
                {ListEntries}
            </div>
        )
    }
}
class AbstractView extends React.PureComponent {
    //{ visibleEntries, activeEntry, activePane, entries, showAddEntry }
    render() {
        // 1. Search Bar
        //var searchBar = <SearchBar search={this.props.search} ids={Object.keys(this.props.allEntries.toJS())} />

        // 2. List of Entries
        var passDown = this.props // need to be finer
        var AbstractLists = []
        var otherListTitle = 'Others'
        if (this.props.visibleEntries) {// If entries are defined
            if (this.props.visibleEntries.get('favorites').size === 0 && this.props.visibleEntries.get('others').size !== 0) {
                otherListTitle = 'All'
            }
            if (this.props.visibleEntries.get('favorites').size !== 0) { // if  favorites
                AbstractLists.push(<AbstractList {...Object.assign({}, passDown, { list: this.props.visibleEntries.get('favorites'), title: 'Favorites' }) } />)
            }
            if (this.props.visibleEntries.get('others').size !== 0) {
                AbstractLists.push(<AbstractList {...Object.assign({}, passDown, { list: this.props.visibleEntries.get('others'), title: otherListTitle }) } />)
            }
        }
        return (
            <div id={sty['entries']} >
                <Search deactivateSearch={this.props.deactivateSearch} search={this.props.search} />
                <div className={sty['abstract-lists']}>{AbstractLists}</div>
            </div>
        )
    }
}
export default AbstractView