import { connect } from 'react-redux'
import { ENTRY_CLICK, SEARCH_ENTRIES } from 'actions'
import Entries from './entries.jsx'
import db_store from '../../backend/database_store'

// Helper Functions

const mapStateToProps = state => {
    var entries = state.getIn(['gui', 'activeEntries'])
    return {
        allEntries: state.getIn(['db', 'entries']),
        visibleEntries: entries,
        activeEntry: state.getIn(['gui', 'activeEntry']),
        activePane: state.getIn(['gui', 'activePane']),
        tagColors: state.getIn(['db', 'tags_color']),
        last_action: state.getIn(['logger', 'last_action'])
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