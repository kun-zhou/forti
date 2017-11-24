import { connect } from 'react-redux'
import { ENTRY_CLICK, SEARCH_SECRETS, DEACTIVATE_SEARCH } from 'actions'
import Entries from './entries.jsx'

// Helper Functions

const mapStateToProps = state => {
    return {
        activeNavTabType:state.getIn(['gui', 'activeNavTabType']),
        activeNavTab:state.getIn(['gui', 'activeNavTab']),
        visibleEntries: state.getIn(['gui', 'activeEntries']),
        activeEntry: state.getIn(['gui', 'activeInfo']) ? state.getIn(['gui', 'activeInfo', 'id']) : null,
        activePane: state.getIn(['gui', 'activePane']),
        category_icons: state.getIn(['gui', 'nav', 'categories'])
    }
}

const mapDispatchToProps = dispatch => ({
    entryClick: (entry_id, idx) => {
        dispatch(ENTRY_CLICK(entry_id, idx))
    },
    search: (keywords) => {
        dispatch(SEARCH_SECRETS(keywords))
    },
    deactivateSearch: () => {
        dispatch(DEACTIVATE_SEARCH())
    }
})

const EntriesWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(Entries)

export default EntriesWrapper