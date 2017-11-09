import { connect } from 'react-redux'
import { CREATE_SECRET, DELETE_SECRET, UPDATE_TITLE, ADD_SECTION, UPDATE_SECTION_TITLE, UPDATE_FIELD, UPDATE_FAV, ADD_TAG, DEL_TAG } from 'actions'
import Info from './info.jsx'
import config from '../../utils/config'

// Helper Functions
const mapStateToProps = state => {
    return {
        info: state.gui.activeInfo,
        entries: config.getTemplateList()
    }
}

const mapDispatchToProps = dispatch => ({
    updateTitle: (id, value) => {
        dispatch(UPDATE_TITLE(id, value))
    },
    updateSectionTitle: (id, section_header, new_header) => {
        dispatch(UPDATE_SECTION_TITLE(id, section_header, new_header))
    },
    updateField: (id, section_idx, field_idx, content, operation) => {
        dispatch(UPDATE_FIELD(id, field_id, property, content, operation))
    },
    addSection: (id) => {
        dispatch(ADD_SECTION(id))
    },
    createSecret: (category) => {
        dispatch(CREATE_SECRET(category))
    },
    updateFav: (id, operation) => {
        dispatch(UPDATE_FAV(id, operation))
    },
    deleteSecret: (id) => {
        dispatch(DELETE_SECRET(id))
    },
    addTag: (id, tag) => {
        dispatch(ADD_TAG(id, tag))
    },
    deleteTag: (tag) => {
        dispatch(DEL_TAG(tag))
    }
})

const InfoWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(Info)

export default InfoWrapper