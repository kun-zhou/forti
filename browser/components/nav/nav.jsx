import React from 'react'
import sty from './nav.cssm'
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import { List } from 'immutable'
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
        return (
            <div className={sty['categories-wrapper']}>
                <div className={sty['section-header']} onClick={this.toggleCollapse}>
                    {this.props.title}
                    {this.state.collapse ? <ExpandMore /> : <ExpandLess />}
                </div>
                <Collapse in={!this.state.collapse} >
                    {this.props.children}
                </Collapse>
            </div>
        )
    }
}

class CategoryList extends React.PureComponent {
    render() {
        var categories_list = List([])
        var name, icon
        for (var category of this.props.categories_config) {
            name = category[0]
            icon = category[1]
            var _cat_list = this.props.categories_cache.get(name)
            if (_cat_list && _cat_list.size > 0) {
                categories_list = categories_list.push(<NavItem
                    activeNavTab={this.props.activeNavTab}
                    activeNavTabType={this.props.activeNavTabType}
                    activePane={this.props.activePane}
                    navTabClick={this.props.navTabClick}

                    key={'_category_' + name}
                    name={name}
                    type='category'
                    icon={<i className={['fal', 'fa-fw', icon].join(' ')} />}
                />)
            }
        }

        return (
            <NavList title={'Categories'}>
                {categories_list}
            </NavList>
        )
    }
}

class TagList extends React.PureComponent {
    render() {
        var tags = this.props.tags
        return (
            <NavList title={'Tags'}>
                {tags.keySeq().map((name) => <NavItem
                    activeNavTab={this.props.activeNavTab}
                    activeNavTabType={this.props.activeNavTabType}
                    activePane={this.props.activePane}
                    navTabClick={this.props.navTabClick}

                    key={'_tag_' + name}
                    name={name}
                    type='tag'
                    icon={<i className='fal fa-hashtag' style={{ 'color': 'grey' }} />}
                />)}
            </NavList>
        )
    }
}

class Nav extends React.PureComponent {
    render() {
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
                    navTabClick={this.props.navTabClick}

                    categories_cache={this.props.categories_cache}
                    categories_config={this.props.categories_config}
                />
                <TagList
                    activeNavTab={this.props.activeNavTab}
                    activeNavTabType={this.props.activeNavTabType}
                    activePane={this.props.activePane}
                    navTabClick={this.props.navTabClick}

                    tags={this.props.tags}
                />
            </div>
        )
    }
}

export default Nav