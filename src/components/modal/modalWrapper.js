import React from 'react'
import { connect } from 'react-redux'

class Modal extends React.PureComponent {
    render() {
        if (this.props.modal)
            return this.props.modal
        return null
    }
}

const mapStateToProps = state => ({
    modal: state.getIn(['gui', 'modal']),
})

const mapDispatchToProps = dispatch => ({
    modalResponse: () => {
        console.log('modalResponse TBI')
    }
})


const ModalWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal)

export default ModalWrapper