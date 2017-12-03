import React from 'react'
import sty from './entries.cssm'
import _ from 'lodash'
import Input, { InputAdornment } from 'material-ui/Input';
import OutsideAlerter from '../public/outsideAlerter.jsx'
import * as s from './styles'
import { List, AutoSizer } from 'react-virtualized'

class Entry extends React.PureComponent {
    constructor() {
        super()
        this.handleEntryClick = this.handleEntryClick.bind(this)
    }

    handleEntryClick() {
        this.props.entryClick(this.props.entry.get('id'), this.props.idx)
    }

    render() {
        var props = this.props
        var entryClassNames = [sty['entry']]
        var id = this.props.entry.get('id')
        // 1. Highlight
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
            <s.Abstract
                selected={props.selected}
                active={props.active}
                onClick={this.handleEntryClick}
                style={this.props.style}
            >
                <s.AbstractIndicator />
                <s.AbstractMain
                    selected={props.selected}
                    active={props.active}
                >
                    <s.AbstractTitle >
                        <s.AbstractIcon>
                            <i className={'fal fa-fw ' + props.categories_config.get(props.entry.get('category'))} />
                        </s.AbstractIcon>
                        {props.entry.get('title') ? props.entry.get('title') : <span className={'placeholder'}>A wonderful new secret</span>}
                    </s.AbstractTitle>
                    <s.AbstractTagsWrapper>
                        {tag_field}
                    </s.AbstractTagsWrapper>
                </s.AbstractMain>
            </s.Abstract>
        )
    }
}

class Search extends React.PureComponent {
    constructor(props) {
        super()
        this.debouncedSearch = _.debounce(props.search, 300)
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
    constructor() {
        super()
        this.rowRenderer = this.rowRenderer.bind(this)
    }

    rowRenderer({ index, style }) {
        var id = this.props.activeEntries.get(index)
        var entry = this.props.cachedAbstracts.get(id)
        return <Entry
            selected={this.props.activeEntry === id}
            active={this.props.activePane === 'entries'}
            key={id}
            entryClick={this.props.entryClick}
            categories_config={this.props.categories_config}
            entry={entry}
            idx={index}
            style={style}
        />
    }

    render() {
        var props = this.props
        //{ visibleEntries, activeEntry, activePane, entries, showAddEntry }
        var entries = props.activeEntries
        // handle the case if entries are none
        if (!entries || entries.size === 0) {
            return (<div id={sty['entries']} >
                <Search deactivateSearch={props.deactivateSearch} search={props.search} />
            </div>)
        }

        return (
            <div id={sty['entries']} >
                <Search deactivateSearch={props.deactivateSearch} search={props.search} />
                <div className={sty['abstract-lists']}>
                    <div className={sty['abstract-list']}>
                        <div className={sty['list-title-wrapper']}>
                            <span className={sty['list-title']}>{props.activeNavTab}</span>
                        </div>
                        <AutoSizer >
                            {({ width, height }) => (
                                <List
                                    height={height}
                                    width={width}
                                    rowCount={entries.size}
                                    rowHeight={80}
                                    rowRenderer={this.rowRenderer}
                                    overscanRowCount={20}

                                    cache={props.cachedAbstracts}
                                    activeEntries={props.activeEntries}
                                    activeEntry={props.activeEntry}
                                    activePane={props.activePane}
                                />
                            )}
                        </AutoSizer >
                    </div>
                </div>
            </div>
        )
    }
}

export default AbstractView