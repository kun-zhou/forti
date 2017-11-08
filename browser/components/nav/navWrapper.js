// Container for nav
import { connect } from 'react-redux'
import { NAV_ENTRY_CLICK, DELETE_TAG_FROM_NAV, CHANGE_TAG_COLOR, DISPLAY_MODAL, CLOSE_MODAL } from 'actions'
import Nav from './nav.jsx'

// Functions
const mapStateToProps = state => {
    return {
        categories: state.manifest.categories,
        tags: state.manifest.tags,
        activeNavTab: state.gui.activeNavTab,
        activeNavTabType: state.gui.activeNavTabType,
        activePane: state.gui.activePane
    }
}

const mapDispatchToProps = dispatch => ({
    navTabClick: (navTab, navTabType) => {
        dispatch(NAV_ENTRY_CLICK(navTab, navTabType))
    },
    deleteTagFromNav: (tag) => {
        dispatch(DELETE_TAG_FROM_NAV(tag))
    },
    changeTagColor: (tag, color) => {
        dispatch(CHANGE_TAG_COLOR(tag, color))
    }
})

const NavWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(Nav)

export default NavWrapper