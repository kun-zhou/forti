import React from 'react'
import sty from './entries.cssm'
//import AddEntryDropdown from './addEntry.jsx'

class Entry extends React.Component {
    handleEntryClick = () => {
        this.props.entryClick(this.props.entry.id)
    }
    render() {
        var entryClassNames = [sty['entry']]

        // 1. Highlight
        if (this.props.activeEntry === this.props.entry.id) {
            if (this.props.activePane === 'entries') {
                entryClassNames.push(sty['is-active'])
            } else {
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
                    <h4 className={sty['entry-content-header']} >{this.props.entry.title}</h4>
                    <div className={sty['entry-content-tags']}>
                        {tag_field}
                    </div>
                </div>
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

class Entries extends React.PureComponent {

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
        var ListEntries = !this.props.visibleEntries ? [] :
            this.props.visibleEntries.map((entry) => {
                return <Entry
                    key={entry.id}
                    entryClick={this.props.entryClick}
                    activeEntry={this.props.activeEntry}
                    activePane={this.props.activePane}
                    entry={entry}
                    tag_colors={this.props.tags}
                />
            })
        console.log(this.props.visibleEntries, 'entries')
        return (
            <div id={sty['entries']}>

                <div id={sty['entries-list']}>{ListEntries}</div>
            </div>
        )
    }
}

export default Entries