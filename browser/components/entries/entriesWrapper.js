import { connect } from 'react-redux'
import { ENTRY_CLICK, SEARCH_ENTRIES } from 'actions'
import Entries from './entries.jsx'

// Helper Functions

const mapStateToProps = state => {
    return {
        visibleEntries: state.getIn(['gui', 'activeEntries']),
        activeEntry: state.getIn(['activeInfo']) ? state.getIn(['activeInfo', id]) : null,
        activePane: state.getIn(['gui', 'activePane']),
        tags: state.getIn(['gui', 'nav', 'tags']),
    }
}

const mapDispatchToProps = dispatch => ({
    entryClick: (entry_id) => {
        dispatch(ENTRY_CLICK(entry_id))
    },
    search: (ids, keywords) => {
        dispatch(SEARCH_ENTRIES(ids, keywords))
    },
})

const EntriesWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(Entries)

export default EntriesWrapper