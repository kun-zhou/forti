import { connect } from 'react-redux'
import { CREATE_SECRET, DELETE_SECRET, UPDATE_META, UPDATE_CUSTOM } from 'actions'
import Info from './info.jsx'
import config from '../../utils/config'

// Helper Functions
const mapStateToProps = state => {
    return {
        info: state.getIn(['gui', 'activeInfo']),
        categories: state.getIn(['gui', 'nav', 'categories']),
    }
}

const mapDispatchToProps = dispatch => ({
    updateMeta: (operation, params) => {
        dispatch(UPDATE_META(operation, params))
    },
    updateCustom: (operation, params) => {
        dispatch(UPDATE_CUSTOM(operation, params))
    },
    createSecret: (category) => {
        dispatch(CREATE_SECRET(category))
    },
    deleteSecret: () => {
        dispatch(DELETE_SECRET())
    },
    addTag: (tag) => {
        dispatch(ADD_TAG(tag))
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