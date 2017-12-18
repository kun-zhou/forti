import React from 'react'
import sty from '../../sty.cssm'
import OutsideAlerter from '../../../../public/outsideAlerter'
 // for 'copied' notifications

class NameField extends React.PureComponent {
    render() {
        if (!this.props.name_editing) {
            return (
                <div
                    className={sty['field-name-display']}
                    onClick={this.props.handleNameFieldClick}
                >
                    {this.props.local_name ? this.props.local_name : <span className={sty['div-placeholder']}>key</span>}
                </div>
            )
        } else {
            return (
                <OutsideAlerter handleClickOutside={this.props.toggleNameEdit} bindOnMount={true}>
                    <input
                        className={sty['field-name-input']}
                        type='text'
                        value={this.props.local_name}
                        placeholder={'key'}
                        onChange={this.props.editLocalName}
                        ref={(e) => e ? e.focus() : {}}
                    />
                </OutsideAlerter>
            )
        }
    }
}

export default NameField