import React from 'react'
import sty from './nav.cssm'
import Collapse from 'public/components/collapse.jsx'
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';

class NavItem extends React.PureComponent {
    constructor(props) {
        super(props)
    }
    navTabClick = () => {
        this.props.navTabClick(this.props.name, this.props.type)
    }

    render() {
        if (this.props.name === this.props.activeNavTab && this.props.type === this.props.activeNavTabType) {
            if (this.props.activePane === 'nav')
                var classNames = [sty['entry'], sty['is-active']].join(' ')
            else
                var classNames = [sty['entry'], sty['is-selected']].join(' ')
        } else var classNames = sty['entry']
        return (
            <div
                className={classNames}
                onClick={this.navTabClick}
                onContextMenu={this.handleNavEntryContext}
            >
                {this.props.icon} {this.props.name}
            </div>
        )
    }
}

class NavList extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            collapse: false
        }
    }

    toggleCollapse = () => {
        this.setState({ collapse: !this.state.collapse })
    }

    render() {
        // 1. COMPONENT
        var secTitle = (
            <div className={sty['section-header']} onClick={this.toggleCollapse}>
                {this.props.title}
                {this.state.collapse ? <ExpandMore /> : <ExpandLess />}
            </div>
        )
        // RENDER
        return (
            <div className={sty['categories-wrapper']}>
                {secTitle}
                <Collapse in={!this.state.collapse}>
                    {this.props.children}
                </Collapse>
            </div>
        )
    }
}

class CategoryList extends React.PureComponent {
    render() {
        // 1. Category Items
        var category_entries = []
        for (let category of this.props.categories) {
            category_entries.push(
                <NavItem
                    key={'_category_' + category}
                    name={category[0]}
                    type='category'
                    activeNavTab={this.props.activeNavTab}
                    activeNavTabType={this.props.activeNavTabType}
                    activePane={this.props.activePane}
                    navTabClick={this.props.navTabClick}
                    icon={<i className={['fal', 'fa-fw', category[1]].join(' ')} />}
                />
            )
        }
        return (
            <NavList title={'Categories'}>
                {category_entries}
            </NavList>
        )
    }
}

class TagList extends React.PureComponent {
    render() {
        // 1. Category Items
        var tag_entries = []
        for (let tag of this.props.tags) {
            tag_entries.push(
                <NavItem
                    key={'_tag_' + tag}
                    name={tag[0]}
                    type='tag'
                    activeNavTab={this.props.activeNavTab}
                    activeNavTabType={this.props.activeNavTabType}
                    activePane={this.props.activePane}
                    navTabClick={this.props.navTabClick}
                    icon={<i className='fas fa-fw fa-tag' style={{ 'color': tag[1] }} />}
                />
            )
        }
        return (
            <NavList title={'Tags'}>
                {tag_entries}
            </NavList>
        )
    }
}

class Nav extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        var category_entries = []
        return (
            <div id={sty['nav']}>
                <div className={sty['header-wrapper']} >
                    <div></div>
                </div>
                <div className={sty['section-fixed']}>
                    <NavItem
                        key="favorites"
                        name="Favorites"
                        type="favorite"
                        navTabClick={this.props.navTabClick}
                        activeNavTab={this.props.activeNavTab}
                        activeNavTabType={this.props.activeNavTabType}
                        activePane={this.props.activePane}
                        icon={(<i className='far fa-fw fa-star' />)}
                    />
                    <NavItem
                        key="all"
                        name="All Items"
                        type="all"
                        navTabClick={this.props.navTabClick}
                        activeNavTab={this.props.activeNavTab}
                        activeNavTabType={this.props.activeNavTabType}
                        activePane={this.props.activePane}
                        icon={(<i className='far fa-fw fa-badge' />)}
                    />
                </div>
                <CategoryList
                    activeNavTab={this.props.activeNavTab}
                    activeNavTabType={this.props.activeNavTabType}
                    activePane={this.props.activePane}
                    categories={this.props.categories}
                    navTabClick={this.props.navTabClick}
                />
                <TagList
                    activeNavTab={this.props.activeNavTab}
                    activeNavTabType={this.props.activeNavTabType}
                    activePane={this.props.activePane}
                    tags={this.props.tags}
                    navTabClick={this.props.navTabClick}
                />
            </div>
        )
    }
}

export default Nav