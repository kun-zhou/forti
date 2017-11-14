import React from 'react'
import sty from './sty.cssm'

class AddField extends React.PureComponent {

    addField = () => {
        this.props.addField(this.props.sec_idx)
    }

    render() {
        return (
            <div className={sty['btn-wrapper']}>
                <div className={sty['add-field']}>
                    <div
                        className={sty['btn-add-field']}
                        onClick={this.addField}
                    >
                        + Field
                    </div>
                </div>
            </div>
        )
    }
}
export default AddField