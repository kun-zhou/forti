import React from 'react'
import sty from './sty.cssm'

class AddFieldSection extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    addField = () => {
        this.props.addField(this.props.sec_idx)
    }

    addSection = () => {
        this.props.addSection()
    }

    render() {
        return (
            <div className={sty['btn-wrapper']}>
                <div
                    className={sty['btn-left']}
                    onClick={this.addField}
                >
                    + Field
                    </div>
                <div
                    className={sty['btn-right']}
                    onClick={this.props.addSection}
                >
                    + Section
                    </div>
            </div>
        )
    }
}

export default AddFieldSection