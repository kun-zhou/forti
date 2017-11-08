import React from 'react'
import sty from './sty.cssm'

class AddFieldSection extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className={sty['btn-wrapper']}>
                <div className={sty['add-field']}>
                    <div
                        className={sty['btn-add-left']}
                        onClick={this.props.addField}
                    >
                        + Field
                    </div>
                </div>
                <div className={sty['add-section']}>
                    <div
                        className={sty['btn-add-right']}
                        onClick={this.props.addSection}
                    >
                        + Section
                    </div>
                </div>
            </div>
        )
    }
}

export default AddFieldSection