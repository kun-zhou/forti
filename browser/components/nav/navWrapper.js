// Container for nav

import { connect } from 'react-redux'
import { NAV_ENTRY_CLICK } from 'actions'
import Nav from './nav'

// Functions
const mapStateToProps = state => {
    return {
        categories_config: state.getIn(['config', 'categories']),
        categories_cache: state.getIn(['cache', 'categories']),
        tags: state.getIn(['cache', 'tags']),
        activeNavTab: state.getIn(['gui', 'activeNavTab']),
        activeNavTabType: state.getIn(['gui', 'activeNavTabType']),
        activePane: state.getIn(['gui', 'activePane']),
    }
}

const mapDispatchToProps = dispatch => ({
    navTabClick: (navTab, navTabType) => {
        dispatch(NAV_ENTRY_CLICK(navTab, navTabType))
    }
})

const NavWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(Nav)

export default NavWrapper