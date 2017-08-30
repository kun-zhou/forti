import { connect } from 'react-redux'
import { ENTRY_CLICK, CREATE_ENTRY, EDIT_TITLE, EDIT_FIELD, ADD_FIELD, MARK_FAV, UNMARK_FAV, DELETE_ENTRY, ADD_TAG, DEL_TAG } from 'actions'
import Info from './info.jsx'
import config from '../../backend/config'

// Helper Functions

const mapStateToProps = state => {
    return {
        info: state.getIn(['db', 'entries', state.getIn(['gui', 'activeEntry'])]),
        entries: config.getTemplateList()
    }
}

const mapDispatchToProps = dispatch => ({
    editTitle: (id, value) => {
        dispatch(EDIT_TITLE(id, value))
    },
    editField: (id, field_id, property, value) => {
        dispatch(EDIT_FIELD(id, field_id, property, value))
    },
    addField: (id, section, type) => {
        dispatch(ADD_FIELD(id, section, type))
    },
    createEmptyEntry: (category) => {
        dispatch(CREATE_ENTRY(category))
    },
    markFav: (id) => {
        dispatch(MARK_FAV(id))
    },
    unmarkFav: (id) => {
        dispatch(UNMARK_FAV(id))
    },
    deleteEntry: (id) => {
        dispatch(DELETE_ENTRY(id))
    },
    addTag: (id, tag) => {
        dispatch(ADD_TAG(id, tag))
    },
    delTag: (tag) => {
        dispatch(DEL_TAG(tag))
    }
})

const InfoWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(Info)

export default InfoWrapper