import React from 'react'
import sty from './sty.cssm'

class AddField extends React.PureComponent {

    addField = () => {
        this.props.addField(this.props.sec_idx)
    }

    render() {
        return (
            <div className={sty['btn-wrapper']}>
                <div
                    className={sty['btn'] }
                    onClick={this.addField}
                >
                    + Field
                    </div>
            </div>
        )
    }
}
export default AddField