import React from 'react'
import sty from './sty.cssm'

class AddField extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className={sty['btn-wrapper']}>
                <div className={sty['add-field']}>
                    <div
                        className={sty['btn-add-field']}
                        onClick={this.props.addField}
                    >
                        + Field
                    </div>
                </div>
            </div>
        )
    }
}
export default AddField