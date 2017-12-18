import React from 'react'
import Collapse from 'material-ui/transitions/Collapse'
import ExpandLess from 'material-ui-icons/ExpandLess'
import ExpandMore from 'material-ui-icons/ExpandMore'
import { List } from 'immutable'
import * as s from './styles'
import HashTag from 'public/svg/hashtag.svg'

class NavItem extends React.PureComponent {
    constructor(props) {
        super(props)
        this.navTabClick = this.navTabClick.bind(this)
    }

    navTabClick() {
        this.props.navTabClick(this.props.name, this.props.type)
    }

    render() {
        return <s.Button
            selected={this.props.name === this.props.activeNavTab && this.props.type === this.props.activeNavTabType}
            active={this.props.activePane === 'nav'}
            onClick={this.navTabClick}>{this.props.icon} {this.props.name}
        </s.Button>

    }
}

class NavList extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            open: true
        }
        this.toggleDisplay = this.toggleDisplay.bind(this)
    }

    toggleDisplay() {
        this.setState({ open: !this.state.open })
    }

    render() {
        return (
            <div>
                <s.Header onClick={this.toggleDisplay}>
                    {this.props.title}
                    {this.state.open ? <ExpandMore /> : <ExpandLess />}
                </s.Header>
                <Collapse in={this.state.open} >
                    {this.props.children}
                </Collapse>
            </div>
        )
    }
}


class FixedList extends React.PureComponent {
    render() {
        return (
            <div>
                <NavItem
                    navTabClick={this.props.navTabClick}
                    activeNavTab={this.props.activeNavTab}
                    activeNavTabType={this.props.activeNavTabType}

                    key="favorites"
                    name="Favorites"
                    type="favorite"
                    activePane={this.props.activePane}
                    icon={(<i className='far fa-fw fa-star' />)}
                />
                <NavItem
                    navTabClick={this.props.navTabClick}
                    activeNavTab={this.props.activeNavTab}
                    activeNavTabType={this.props.activeNavTabType}

                    key="all"
                    name="All Items"
                    type="all"
                    activePane={this.props.activePane}
                    icon={(<i className='far fa-fw fa-badge' />)}
                />
            </div>
        )
    }
}

class CategoryList extends React.PureComponent {
    render() {
        var categories_list = List()
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
                    icon={<i className={[icon, 'fa-fw'].join(' ')} />}
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
                    icon={<HashTag fill={'white'} width={'10px'} style={{rightMargin: '3px'}}/>}
                />)}
            </NavList>
        )
    }
}

class Nav extends React.PureComponent {
    render() {
        return (
            <s.Pane>
                <s.TopPlaceholder />
                <FixedList
                    navTabClick={this.props.navTabClick}
                    activeNavTab={this.props.activeNavTab}
                    activeNavTabType={this.props.activeNavTabType}
                    activePane={this.props.activePane}
                />
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
            </s.Pane>
        )
    }
}

export default Nav
