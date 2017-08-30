// Container for nav
import { connect } from 'react-redux'
import { NAV_ENTRY_CLICK, DELETE_TAG_FROM_NAV, CHANGE_TAG_COLOR, DISPLAY_MODAL, CLOSE_MODAL } from 'actions'
import Nav from './nav.jsx'
import db_store from '../../backend/database_store'

// Functions
const mapStateToProps = state => {
    return {
        categories_order: state.getIn(['db', 'categories_order']),
        categories_icon: state.getIn(['db', 'categories_icon']),
        tags_order: state.getIn(['db', 'tags_order']),
        tags_color: state.getIn(['db', 'tags_color']),
        activeNavTab: state.getIn(['gui', 'activeNavTab']),
        activeNavTabType: state.getIn(['gui', 'activeNavTabType']),
        activePane: state.getIn(['gui', 'activePane'])
    }
}

const mapDispatchToProps = dispatch => ({
    navTabClick: (navTab, navTabType) => {
        dispatch(NAV_ENTRY_CLICK(navTab, navTabType))
    },
    deleteTagFromNav: (tag) => {
        dispatch(DELETE_TAG_FROM_NAV(tag))
    },
    toggleColorPicker: (picker, show) => {
        show ?
            dispatch(DISPLAY_MODAL(picker)) :
            dispatch(CLOSE_MODAL())
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