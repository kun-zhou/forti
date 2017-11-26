import { connect } from 'react-redux'
import { ENTRY_CLICK, SEARCH_SECRETS, DEACTIVATE_SEARCH } from 'actions'
import Entries from './entries.jsx'

// Helper Functions

const mapStateToProps = state => {
    var gui = state.get('gui')
    return {
        activeNavTab: gui.get('activeNavTab'),
        activeEntry: gui.get('activeInfo') ? gui.getIn(['activeInfo', 'id']) : null,
        activePane: gui.get('activePane'),
        categories_config: state.getIn(['config', 'categories']),
        cachedAbstracts: state.getIn(['cache', 'abstracts']),
        activeEntries: gui.get('activeEntries')
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