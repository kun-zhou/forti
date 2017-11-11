import React from 'react'
import sty from './nav.cssm'
import Collapse from 'material-ui/transitions/Collapse';
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
        return (
            <NavList title={'Categories'}>
                {this.props.categories.map((category_icon, category_name) => {
                    if (this.props.categories_count.get(category_name)) {
                        return <NavItem
                            activeNavTab={this.props.activeNavTab}
                            activeNavTabType={this.props.activeNavTabType}
                            activePane={this.props.activePane}
                            navTabClick={this.props.navTabClick}

                            key={'_category_' + category_name.name}
                            name={category_name.name}
                            type='category'
                            icon={<i className={['fal', 'fa-fw', category_icon].join(' ')} />}
                        />
                    } else {
                        return null
                    }
                })}
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

            )
        }
        return (
            <NavList title={'Tags'}>
                {this.props.tag.map((tag_color, tag_name) => (
                    <NavItem
                        activeNavTab={this.props.activeNavTab}
                        activeNavTabType={this.props.activeNavTabType}
                        activePane={this.props.activePane}
                        navTabClick={this.props.navTabClick}

                        key={'_tag_' + tag}
                        name={tag_name}
                        type='tag'
                        icon={<i className='fas fa-fw fa-tag' style={{ 'color': tag_colorƒ }} />}
                    />
                ))}
            </NavList>
        )
    }
}

class Nav extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        console.log(this.props.categories)
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

                    categories={this.props.categories}
                    categories_count={this.props.categories_count}
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