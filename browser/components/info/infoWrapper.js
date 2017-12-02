import {connect} from 'react-redux'
import {CREATE_SECRET, DELETE_SECRET, UPDATE_META, UPDATE_CUSTOM} from 'actions'
import Info from './info.jsx'

// Helper Functions
const mapStateToProps = state => {
    return {
        info: state.getIn(['gui', 'activeInfo']),
        categories_config: state.getIn(['config', 'categories'])
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
    }
})

const InfoWrapper = connect(mapStateToProps, mapDispatchToProps)(Info)

export default InfoWrapper