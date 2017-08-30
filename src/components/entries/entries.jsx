import React from 'react'
import sty from './entries.cssm'
//import AddEntryDropdown from './addEntry.jsx'

function Tag({ tag, color }) {
    return (
        <div className={sty['tag']} style={{ 'backgroundColor': color }}>{tag}</div>
    )
}

function Tags({ tags, colors }) {
    var result = []
    for (let tag of tags) {
        result.push(<Tag tag={tag} color={colors.get(tag)} />)
    }
    return (
        <div className={sty['entry-content-tags']}>
            {result}
        </div>
    )
}

function Entry({ entryClick, activeEntry, activePane, entry, tags_color }) {
    var entryClassNames = [sty['entry']]
    var id = entry.get('id')
    if (activeEntry === id) {
        if (activePane === 'entries') {
            entryClassNames.push(sty['is-active'])
        } else {
            entryClassNames.push(sty['is-selected'])
        }
    }
    entryClassNames = entryClassNames.join(' ')

    return (
        <div className={entryClassNames} onClick={() => { entryClick(id) }} >
            <div className={sty['entry-filler']}></div>
            <div className={sty['entry-content']}>
                <h4 className={sty['entry-content-header']} >{entry.get('title')}</h4>
                <Tags tags={entry.get('tags')} colors={tags_color} />
            </div>
        </div>
    )
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
    constructor(props) {
        super(props)
        this.state = { addEntryVisible: false }
        this.toggleAddEntry = this.toggleAddEntry.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.last_action !== 'EDIT_FIELD'
    }

    toggleAddEntry() {
        this.setState({ addEntryVisible: !this.state.addEntryVisible })
    }

    //{ visibleEntries, activeEntry, activePane, entries, showAddEntry }
    render() {
        console.log('Entries rendered')
        var searchBar = <SearchBar search={this.props.search} ids={Object.keys(this.props.allEntries.toJS())} />
        if (this.props.visibleEntries === 'loading') {
            return <div id={sty['entries']}>
                {searchBar}
            </div>
        }
        var ListEntries = this.props.visibleEntries.map((id) => {
            return <Entry
                entryClick={this.props.entryClick}
                activeEntry={this.props.activeEntry}
                activePane={this.props.activePane}
                entry={this.props.allEntries.get(id)}
                tags_color={this.props.tagColors}
            />
        })
        return (
            <div id={sty['entries']}>
                {searchBar}
                <div id={sty['entries-list']}>{ListEntries}</div>
            </div>
        )//<AddEntryDropdown addEntryVisible={this.state.addEntryVisible}/>
    }
}

export default Entries