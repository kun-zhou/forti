import { connect } from 'react-redux'
import { } from 'actions'
import React from 'react'
import Dialog, { DialogTitle } from 'material-ui/Dialog'

class Setting extends React.PureCompoent {
    render() {
        
    }
}
// Functions
const mapStateToProps = state => {
    return {
        categories: state.getIn(['gui', 'nav', 'categories']),
        categories_count: state.getIn(['gui', 'nav', 'categories_count']),
        tags: state.getIn(['gui', 'nav', 'tags']),
        activeNavTab: state.getIn(['gui', 'activeNavTab']),
        activeNavTabType: state.getIn(['gui', 'activeNavTabType']),
        activePane: state.getIn(['gui', 'activePane']),
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

const SettingWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(Setting)

export default NavWrapper