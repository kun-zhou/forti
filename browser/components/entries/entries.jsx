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
                        {this.props.entry.get('title') ? this.props.entry.get('title') : <span className={'placeholder'}>A wonderful new secret</span>}
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

class AbstractView extends React.PureComponent {
    //{ visibleEntries, activeEntry, activePane, entries, showAddEntry }
    render() {
        var entries = this.props.visibleEntries
        // handle the case if entries are none
        if (!entries || entries.size === 0) {
            return (<div id={sty['entries']} >
                <Search deactivateSearch={this.props.deactivateSearch} search={this.props.search} />
            </div>)
        }
        // 1. List of Entries
        var list = []
        for (var i = 0; i !== entries.size; i++) {
            var entry = entries.get(i)
            list.push(<Entry
                key={entry.get('id')}
                entryClick={this.props.entryClick}
                activeEntry={this.props.activeEntry}
                activePane={this.props.activePane}
                category_icons={this.props.category_icons}
                entry={entry}
                idx={i}
            />)

        }
        /*
         var favorites_list = []
         var others_list = []
 
         for (var i = 0; i !== entries.size; i++) {
             var entry = entries.get(i)
             if (entry.get('favorite')) {
                 favorites_list.push(<Entry
                     key={entry.get('id')}
                     entryClick={this.props.entryClick}
                     activeEntry={this.props.activeEntry}
                     activePane={this.props.activePane}
                     tag_colors={this.props.tag_colors}
                     category_icons={this.props.category_icons}
                     entry={entry}
                     idx={i}
                 />)
             } else {
                 others_list.push(<Entry
                     key={entry.get('id')}
                     entryClick={this.props.entryClick}
                     activeEntry={this.props.activeEntry}
                     activePane={this.props.activePane}
                     tag_colors={this.props.tag_colors}
                     category_icons={this.props.category_icons}
                     entry={entry}
                     idx={i}
                 />)
             }
         }
          var otherListTitle = 'Others'

        if (favorites_list.length === 0) {
            otherListTitle = 'All'
        }
 */
       

        return (
            <div id={sty['entries']} >
                <Search deactivateSearch={this.props.deactivateSearch} search={this.props.search} />
                <div className={sty['abstract-lists']}>
                    <div className={sty['abstract-list']}>
                        <div className={sty['list-title-wrapper']}>
                            <span className={sty['list-title']}>{this.props.activeNavTab}</span>
                        </div>
                        {list}
                    </div>
                </div>
            </div>
        )
    }
}
export default AbstractView