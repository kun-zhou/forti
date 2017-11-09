import React from 'react'
import sty from '../../sty.cssm'
import OutsideAlerter from '../../../../public/outsideAlerter.jsx'

class NameField extends React.PureComponent {
    render() {
        if (!this.props.name_editing) {
            return (
                <div
                    className={sty['field-name-display']}
                    onClick={this.props.toggleNameEdit}
                >
                    {this.props.local_name ? this.props.local_name : <span className={sty['div-placeholder']}>field name</span>}
                </div>
            )
        } else {
            return (
                <OutsideAlerter handleClickOutside={this.props.toggleNameEdit}>
                    <input
                        className={sty['field-name-input']}
                        type='text'
                        value={this.props.local_name}
                        placeholder={'field name'}
                        onChange={this.props.editLocalName}
                    />
                </OutsideAlerter>
            )
        }
    }
}

export default NameField