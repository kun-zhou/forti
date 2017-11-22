/**
 * THIS IS AN HOC that adds autohide on outside click functionality to the passed in React Component.
 * All props passed to the WrapperComponent will be passed down to 
 * the WrappedComponent.
 * special props needed is onHide.
 */

import React from 'react'

function makeAutohide(WrappedComponent) {
    return class extends React.PureComponent {
        constructor(props) {
            super(props)
            this.handleClick = this.handleClick.bind(this)
        }

        handleClick(e) {
            if (!this.wrapperNode.contains(e.target)) {
                // execute onHide (probably unmounting this instance)
                this.props.onHide()
            }
        }

        componentDidMount() {
            /* add a listener to the wrapper component to make
             * any clicks outside of the wrapper component
             * execute `onHide` as passed from the props.
             */
            document.addEventListener('click', this.handleClick)
        }

        componentWillUnmount() {
            document.removeEventListener('click', this.handleClick)
        }

        render() {
            var _props = Object.assign({}, this.props)
            delete _props.onHide
            return (
                <div ref={(i) => { this.wrapperNode = i }}>
                    <WrappedComponent {..._props} />
                </div>
            )
        }
    }
}
export default makeAutohide