import { connect } from 'react-redux'
import { ENTRY_CLICK, CREATE_ENTRY, EDIT_TITLE, EDIT_SECTION_HEADER, EDIT_FIELD, DEL_FIELD, ADD_FIELD, ADD_SECTION, MARK_FAV, UNMARK_FAV, DELETE_ENTRY, ADD_TAG, DEL_TAG } from 'actions'
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
    editSectionHeader: (id, section_header, new_header) => {
        dispatch(EDIT_SECTION_HEADER(id, section_header, new_header))
    },
    editField: (id, field_id, property, value) => {
        dispatch(EDIT_FIELD(id, field_id, property, value))
    },
    delField: (id, idx, field_id) => {
        dispatch(DEL_FIELD(id, idx, field_id))
    },
    addField: (id, section, type) => {
        dispatch(ADD_FIELD(id, section, type))
    },
    addSection: (id, idx) => {
        dispatch(ADD_SECTION(id, idx))
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