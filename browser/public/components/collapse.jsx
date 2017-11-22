import React from 'react'
export default class Collapse extends React.PureComponent {
    constructor() {
        super()
        this.wrapperStyle = {
            transition: 'height 200ms',
            overflow: 'hidden'
        }
    }
    componentDidMount() {
        this.forceUpdate()
    }
    /**
     * Should receive 
     * 1. 'in': boolean indicating show/hide
     * 2. children
     */
    render() {
        if (this.props.in) {
            if (this.innerWrapper) {
                this.wrapperStyle.height = this.innerWrapper.clientHeight + 10
            } else {
                delete this.wrapperStyle.height
            }
        } else {
            this.wrapperStyle.height = 0
        }
        return (
            <div style={this.wrapperStyle}>
                <div ref={(e) => { this.innerWrapper = e }}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}