import { connect } from 'react-redux'
import { ENTRY_CLICK, SEARCH_SECRETS, DEACTIVATE_SEARCH } from 'actions'
import Entries from './entries.jsx'

// Helper Functions

const mapStateToProps = state => {
    var activeNavTab = state.getIn(['gui', 'activeNavTab'])
    var activeNavTabType = state.getIn(['gui', 'activeNavTabType'])
    return {
        activeNavTab,
        activeEntry: state.getIn(['gui', 'activeInfo']) ? state.getIn(['gui', 'activeInfo', 'id']) : null,
        activePane: state.getIn(['gui', 'activePane']),
        categories_config: state.getIn(['config', 'categories']),
        cachedAbstracts: state.getIn(['cache', 'abstracts']),
        activeEntries: getEntries(activeNavTabType, activeNavTab, state.get('cache'))
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

function getEntries(type, name, cache) {
    switch (type) {
        case 'all':
            return cache.get('all')
        case 'favorite':
            return cache.get('favorites')
        case 'category':
            return cache.getIn(['categories', name])
        case 'tag':
            return cache.getIn(['tags', name])
        case 'trash':
            return cache.get('trash')
        default:
            return null
    }
}