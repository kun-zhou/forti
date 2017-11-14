import { connect } from 'react-redux'
import { ENTRY_CLICK, SEARCH_SECRETS, DEACTIVATE_SEARCH } from 'actions'
import Entries from './entries.jsx'

// Helper Functions

const mapStateToProps = state => {
    return {
        visibleEntries: state.getIn(['gui', 'activeEntries']),
        activeEntry: state.getIn(['gui', 'activeInfo']) ? state.getIn(['gui', 'activeInfo', 'id']) : null,
        activePane: state.getIn(['gui', 'activePane']),
        tag_colors: state.getIn(['gui', 'nav', 'tags']),
        category_icons: state.getIn(['gui', 'nav', 'categories'])
    }
}

const mapDispatchToProps = dispatch => ({
    entryClick: (entry_id) => {
        dispatch(ENTRY_CLICK(entry_id))
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