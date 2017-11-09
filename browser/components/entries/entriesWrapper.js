import { connect } from 'react-redux'
import { ENTRY_CLICK, SEARCH_ENTRIES } from 'actions'
import Entries from './entries.jsx'

// Helper Functions

const mapStateToProps = state => {
    console.log(state.gui.activeEntries, 'active entries')
    return {
        visibleEntries: state.gui.activeEntries,
        activeEntry: state.gui.activeEntry,
        activePane: state.gui.activePane,
        tags: state.gui.nav.tags
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