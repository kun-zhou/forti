import React from 'react'
import sty from './nav.cssm'
import { remote } from 'electron'

const { Menu, MenuItem, dialog } = remote
import { TwitterPicker } from 'react-color'
import makeAutohide from 'public/components/Autohide/Autohide.jsx'
const AutohideColorPicker = makeAutohide(TwitterPicker)

class CategoryEntry extends React.PureComponent {
    constructor(props) {
        super(props)
        this.handleNavEntryContext = this.handleNavEntryContext.bind(this)
        this.state = {
            x: 0,
            y: 0,
        }
        this.menu = new Menu()
        this.menu.append(new MenuItem({
            label: 'Change Icon',
            click: () => {
                console.log(this)
            }
        }))
    }

    handleNavEntryContext(e) {
        this.setState({ x: e.pageX, y: e.pageY })
        this.menu.popup(remote.getCurrentWindow())
    }

    render() {
        if (this.props.name === this.props.activeNavTab) {
            if (this.props.activePane === 'nav')
                var classNames = [sty['entry'], sty['is-active']].join(' ')
            else
                var classNames = [sty['entry'], sty['is-selected']].join(' ')
        } else var classNames = sty['entry']

        return (
            <div
                className={classNames}
                onClick={this.props.navTabClick}
                onContextMenu={this.handleNavEntryContext}
            >
                {this.props.icon} {this.props.name}
            </div>
        )
    }
}

class TagEntry extends React.PureComponent {
    constructor(props) {
        super(props)

        this.handleNavEntryContext = this.handleNavEntryContext.bind(this)
        this.deleteTagFromNav = this.deleteTagFromNav.bind(this)
        this.handlePickerMount = this.handlePickerMount.bind(this)

        this.state = {
            x: 0,
            y: 0,
        }

        this.menu = new Menu()
        this.menu.append(new MenuItem({
            label: 'Change Color',
            click: () => {
                var picker = (
                    <div
                        style={{ position: 'fixed', zIndex: '10000', left: this.state.x - 7, top: this.state.y + 20 }}
                    >
                        <AutohideColorPicker 
                            onChangeComplete={(color) => {this.props.changeTagColor(props.name, color.hex)}}
                            onHide={ () => {this.props.toggleColorPicker(null, false)}}
                            />
                        
                    </div >)
                this.props.toggleColorPicker(picker, true)
            }
        }))
        this.menu.append(new MenuItem({
            label: 'Delete Tag',
            click: () => {
                var response = dialog.showMessageBox({
                    type: 'warning',
                    buttons: ['Cancel', 'Confirm'],
                    title: 'Deletion Confirmation',
                    message: 'Are you sure you want to delete the tag "' + props.name + '" ?'
                })
                console.log('response', response)
                if (response === 1) {
                    this.deleteTagFromNav()
                }
            }
        }))
    }

    handlePickerMount(el) { //el is the node containing color picker
        if (el) {
            el.focus()
            var _this = this
            document.addEventListener('click', function handleClick(e) {
                if (!el.contains(e.target)) {
                    _this.props.toggleColorPicker(null, false)
                    document.removeEventListener('click', handleClick)
                }
            })
        }
    }
    deleteTagFromNav() {
        this.props.deleteTagFromNav(this.props.name)
    }

    handleNavEntryContext(e) {
        this.setState({ x: e.pageX, y: e.pageY })
        this.menu.popup(remote.getCurrentWindow())
    }

    render() {
        if (this.props.name === this.props.activeNavTab) {
            if (this.props.activePane === 'nav')
                var classNames = [sty['entry'], sty['is-active']].join(' ')
            else
                var classNames = [sty['entry'], sty['is-selected']].join(' ')
        } else var classNames = sty['entry']

        return (
            <div
                className={classNames}
                onClick={this.props.navTabClick}
                onContextMenu={this.handleNavEntryContext}
            >
                {this.props.icon} {this.props.name}
            </div>
        )
    }
}

class FixedEntry extends React.PureComponent {
    render() {
        if (this.props.name === this.props.activeNavTab) {
            if (this.props.activePane === 'nav')
                var classNames = [sty['entry'], sty['is-active']].join(' ')
            else
                var classNames = [sty['entry'], sty['is-selected']].join(' ')
        } else var classNames = sty['entry']

        return (
            <div
                className={classNames}
                onClick={this.props.navTabClick}
            >
                {this.props.icon} {this.props.name}
            </div>
        )
    }

}

class SecTitle extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            icon_shown: false,
        }
        this.toggleShowExpandCollapse = this.toggleShowExpandCollapse.bind(this)
    }

    toggleShowExpandCollapse() {
        this.setState(Object.assign({}, this.state, { icon_shown: !this.state.icon_shown }))
    }

    render() {

        if (!this.state.icon_shown) {
            expandCollapseIcon = ''
        } else {
            if (this.props.collapsed) {
                var expandCollapseIcon = <i className='far fa-fw fa-plus' />
            } else {
                var expandCollapseIcon = <i className='far fa-fw fa-minus' />
            }
        }

        return (
            <div className={sty['section-header']}>
                {this.props.sec_title}
                <div className={sty['expand-collapse']} onMouseEnter={this.toggleShowExpandCollapse} onMouseLeave={this.toggleShowExpandCollapse} onClick={this.props.toggleExpandCollapse}>
                    {expandCollapseIcon}
                </div>
            </div>
        )
    }
}

class Categories extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            categories_collapsed: false
        }
        this.toggleCatsExpandCollapse = this.toggleCatsExpandCollapse.bind(this)
    }

    toggleCatsExpandCollapse() {
        this.setState(Object.assign({}, this.state, { categories_collapsed: !this.state.categories_collapsed }))
    }

    render() {
        if (this.state.categories_collapsed) {
            return (
                <div className={sty['categories-wrapper']}>
                    <SecTitle key={'Categories'} sec_title={'Categories'} collapsed={this.state.categories_collapsed} toggleExpandCollapse={this.toggleCatsExpandCollapse} />
                </div>
            )
        }
        return (
            <div className={sty['categories-wrapper']}>
                <SecTitle key={'Categories'} sec_title={'Categories'} collapsed={this.state.categories_collapsed} toggleExpandCollapse={this.toggleCatsExpandCollapse} />
                <div className={sty['categories-content']}>
                    {this.props.categories.map((category) => {
                        return (
                            <CategoryEntry
                                key={'_category_' + category}
                                name={category}
                                type='category'
                                navTabClick={() => this.props.navTabClick(category, 'categories')}
                                activeNavTab={this.props.activeNavTab}
                                activeNavTabType={this.props.activeNavTabType}
                                activePane={this.props.activePane}
                                icon={<i className={['fal', 'fa-fw', this.props.icons.get(category)].join(' ')} />}
                            />
                        )
                    })}
                </div>
            </div>
        )
    }
}

class Tags extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            tags_collapsed: false
        }
        this.toggleTagsExpandCollapse = this.toggleTagsExpandCollapse.bind(this)

    }

    toggleTagsExpandCollapse() {
        this.setState(Object.assign({}, this.state, { tags_collapsed: !this.state.tags_collapsed }))
    }

    render() {
        if (this.state.tags_collapsed) {
            return (
                <div className={sty['tags-wrapper']}>
                    <SecTitle key={'Tags'} sec_title={'Tags'} collapsed={this.state.tags_collapsed} toggleExpandCollapse={this.toggleTagsExpandCollapse} />
                </div>
            )
        }
        return (
            <div className={sty['tags-wrapper']}>
                <SecTitle key={'Tags'} sec_title={'Tags'} collapsed={this.state.tags_collapsed} toggleExpandCollapse={this.toggleTagsExpandCollapse} />
                <div className={sty['tags-content']}>
                    {this.props.tags.map((tag) => {
                        return (
                            <TagEntry
                                key={'_tag_' + tag}
                                name={tag}
                                type='tag'
                                navTabClick={() => this.props.navTabClick(tag, 'tags')}
                                activeNavTab={this.props.activeNavTab}
                                activeNavTabType={this.props.activeNavTabType}
                                activePane={this.props.activePane}
                                toggleColorPicker={this.props.toggleColorPicker}
                                deleteTagFromNav={this.props.deleteTagFromNav}
                                closeColorPicker={this.props.closeColorPicker}
                                changeTagColor={this.props.changeTagColor}
                                icon={<i className='fas fa-fw fa-tag' style={{ 'color': this.props.colors.get(tag) }} />}
                            />
                        )
                    })}
                </div>
            </div>
        )
    }
}

class Nav extends React.PureComponent {
    constructor(props) {
        super(props)
        this.handleFavClick = this.handleFavClick.bind(this)
        this.handleAllClick = this.handleAllClick.bind(this)
    }

    handleFavClick() {
        this.props.navTabClick('Favorites', 'favorites')
    }

    handleAllClick() {
        this.props.navTabClick('All Items', 'all')
    }

    render() {
        return (
            <div id={sty['nav']}>
                <div className={sty['header-wrapper']} >
                    <div></div>
                </div>
                <div className={sty['section-fixed']}>
                    <FixedEntry
                        key="favorites"
                        name="Favorites"
                        navTabClick={this.handleFavClick}
                        activeNavTab={this.props.activeNavTab}
                        activeNavTabType={this.props.activeNavTabType}
                        activePane={this.props.activePane}
                        icon={(<i className='far fa-fw fa-star' />)}
                    />
                    <FixedEntry
                        key="all"
                        name="All Items"
                        navTabClick={this.handleAllClick}
                        activeNavTab={this.props.activeNavTab}
                        activeNavTabType={this.props.activeNavTabType}
                        activePane={this.props.activePane}
                        icon={(<i className='far fa-fw fa-badge' />)}
                    />
                </div>
                <Categories
                    navTabClick={this.props.navTabClick}
                    activeNavTab={this.props.activeNavTab}
                    activeNavTabType={this.props.activeNavTabType}
                    activePane={this.props.activePane}
                    categories={this.props.categories_order}
                    icons={this.props.categories_icon}
                />
                <Tags
                    activeNavTab={this.props.activeNavTab}
                    activeNavTabType={this.props.activeNavTabType}
                    activePane={this.props.activePane}
                    tags={this.props.tags_order}
                    colors={this.props.tags_color}
                    navTabClick={this.props.navTabClick}
                    deleteTagFromNav={this.props.deleteTagFromNav}
                    toggleColorPicker={this.props.toggleColorPicker}
                    closeColorPicker={this.props.closeColorPicker}
                    changeTagColor={this.props.changeTagColor}
                />
            </div>
        )
    }
}

export default Nav