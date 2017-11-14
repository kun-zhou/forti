import React from 'react'
// takes args bindOnMoun
export default class OutsideAlerter extends React.Component {
    componentDidMount() {
        if (this.props.bindOnMount) {
            document.addEventListener('click', this.handleClickOutside)
            window.addEventListener('blur', this.handleWindowBlur)
        }
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside)
        window.removeEventListener('blur', this.handleWindowBlur)
    }
    /**
     * Set the wrapper ref
     */
    addClickListener = () => {
        document.addEventListener('click', this.handleClickOutside)
        window.addEventListener('blur', this.handleWindowBlur)
    }

    setWrapperRef = (node) => {
        this.wrapperRef = node;
    }

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside = (event) => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.handleClickOutside()
            document.removeEventListener('click', this.handleClickOutside)
            window.removeEventListener('blur', this.handleClickOutside)
        }
    }

    handleWindowBlur = () => {
        this.props.handleClickOutside()
        document.removeEventListener('click', this.handleClickOutside)
        window.removeEventListener('blur', this.handleClickOutside)
    }

    render() {
        return (
            <div className={this.props.className} ref={this.setWrapperRef} onClick={this.addClickListener}>
                {this.props.children}
            </div>
        );
    }
}