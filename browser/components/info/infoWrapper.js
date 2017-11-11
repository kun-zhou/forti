import { connect } from 'react-redux'
import { CREATE_SECRET, DELETE_SECRET, UPDATE_META, UPDATE_CUSTOM } from 'actions'
import Info from './info.jsx'
import config from '../../utils/config'

// Helper Functions
const mapStateToProps = state => {
    return {
        info: state.getIn('gui', 'activeInfo'),
        categories: state.getIn('gui', 'nav', 'categories'),
    }
}

const mapDispatchToProps = dispatch => ({
    updateMeta: (id, field, new_field) => {
        dispatch(UPDATE_META(id, field, new_field))
    },
    updateCustom: (id, operation, params) => {
        dispatch(UPDATE_CUSTOM(id, operation, params))
    },
    updateTitle: (id, value) => {
        dispatch(UPDATE_TITLE(id, value))
    },
    updateSectionTitle: (id, sec_idx, new_title) => {
        dispatch(UPDATE_SECTION_TITLE(id, sec_idx, new_title))
    },
    updateField: (id, sec_idx, field_idx, content, operation) => {
        dispatch(UPDATE_FIELD(id, sec_idx, field_idx, content, operation))
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