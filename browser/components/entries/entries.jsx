import React from 'react'
import sty from './entries.cssm'
import _ from 'lodash'
//import AddEntryDropdown from './addEntry.jsx'
import Input, { InputAdornment } from 'material-ui/Input';

class Entry extends React.Component {
    handleEntryClick = () => {
        this.props.entryClick(this.props.entry.id)
    }
    render() {
        var entryClassNames = [sty['entry']]
        // 1. Highlight
        console.log(this.props.activeEntry, this.props.entry.id, 'entry')
        if (this.props.activeEntry === this.props.entry.id) {
            if (this.props.activePane === 'entries') {
                entryClassNames.push(sty['is-active'])
            } else {
                console.log('else reached')
                entryClassNames.push(sty['is-selected'])
            }
        }
        entryClassNames = entryClassNames.join(' ')

        // 2. Tags
        var tag_field = []
        for (let tag of this.props.entry.tags) {
            tag_field.push(
                <div className={sty['tag']} style={{ 'backgroundColor': this.props.tag_colors.get(tag) }}>
                    {tag}
                </div>
            )
        }

        // Render
        return (
            <div className={entryClassNames} onClick={this.handleEntryClick} >
                <div className={sty['entry-filler']}></div>
                <div className={sty['entry-content']}>
                    <div className={sty['entry-content-title']} >
                        <span className={sty['entry-content-title-icon']}><i className='fal fa-fw fa-key' /> </span>
                        {this.props.entry.title}
                    </div>
                    <div className={sty['entry-content-snippet']}>
                        {this.props.entry.snippet}
                    </div>
                    <div className={sty['entry-content-tags']}>
                        {tag_field}
                    </div>
                </div>
            </div>
        )
    }
}

class Search extends React.PureComponent {
    search=(e)=> {
        // Only executes search if the last keyup has occured 0.8 second ago
        clearTimeout(this.state.current_timeout)
        var props = this.props
        this.setState(Object.assign({}, this.state, {
            current_timeout: setTimeout(
                function (keywords) {
                    props.search(props.ids, keywords)
                }, 400, e.target.value
            )
        }))
    }
    render() {
        return (
            <div className={sty['search-wrapper']}>
                <Input
                    fullWidth
                    startAdornment={
                        <InputAdornment position="start">
                            <i className={'far fa-search' + ' ' + sty['search-icon']} />
                        </InputAdornment>
                    }
                />
            </div>
        )
    }
}

class SearchBar extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = { search_focus: false, current_timeout: 0 }
        this.toggleFocus = this.toggleFocus.bind(this)
        this.search = this.search.bind(this)
    }

    toggleFocus() {
        this.setState(Object.assign({}, this.state, { search_focus: !this.state.search_focus }))
    }

    search(e) {
        // Only executes search if the last keyup has occured 0.8 second ago
        clearTimeout(this.state.current_timeout)
        var props = this.props
        this.setState(Object.assign({}, this.state, {
            current_timeout: setTimeout(
                function (keywords) {
                    props.search(props.ids, keywords)
                }, 400, e.target.value
            )
        }))
    }

    render() {
        var input = <input
            type='text'
            className={sty['search-input']}
            placeholder='Search Secrets'
            onFocus={this.toggleFocus}
            onBlur={this.toggleFocus}
            onKeyUp={this.search}
        />
        if (this.state.search_focus) {
            return (
                <div className={[sty['search-wrapper'], sty['search-focus']].join(' ')}>
                    <i className={'far fa-search' + ' ' + sty['search-icon']} />
                    {input}
                </div>
            )
        } else {
            return (
                <div className={sty['search-wrapper']}>
                    <i className={'far fa-search' + ' ' + sty['search-icon']} />
                    {input}
                </div>
            )
        }
    }
}

class AbstractList extends React.PureComponent {
    render() {
        // 1. List of Entries
        var ListEntries = !this.props.list ? [] :
            this.props.list.map((entry) => {
                return <Entry
                    key={entry.id}
                    entryClick={this.props.entryClick}
                    activeEntry={this.props.activeEntry}
                    activePane={this.props.activePane}
                    entry={entry}
                    tag_colors={this.props.tags}
                />
            })
        return (
            <div className={sty['abstract-list']}>
                <div className={sty['list-title']}>
                    <span className={sty['list-title-wrapper']}>
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
        if (this.props.visibleEntries === 'loading') {
            return <div id={sty['entries']}>
                {searchBar}
            </div>
        }
        // 2. List of Entries
        var passDown = _.omit(this.props, ['visibleEntries'])
        var AbstractLists = []
        var otherListTitle = 'Others'
        if (this.props.visibleEntries) {// If entries are defined
            if (this.props.visibleEntries[0].length === 0 && this.props.visibleEntries[1].length !== 0) {
                otherListTitle = 'All'
            }
            if (this.props.visibleEntries[0].length !== 0) { // if  favorites
                AbstractLists.push(<AbstractList {...Object.assign(passDown, { list: this.props.visibleEntries[0], title: 'Favorites' }) } />)
            }
            if (this.props.visibleEntries[1].length !== 0) {
                AbstractLists.push(<AbstractList {...Object.assign(passDown, { list: this.props.visibleEntries[1], title: otherListTitle }) } />)
            }
        }
        return (
            <div id={sty['entries']} >
                <Search>
                </Search>
                {AbstractLists}
            </div>
        )
    }
}
export default AbstractView