import React from 'react'
import sty from './sty.cssm'
import AutosizeInput from './AutosizeInput.jsx'
class SectionTitle extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            title_editing: false,
            title: props.title,
        }
    }

    editLocalSecTitle = (e) => {
        this.setState({ title: e.target.value })
    }

    toggleSecTitleEdit = (e) => {
        //console.log(e.target.tagName, 'tagname')
        if (e.target.tagName === 'INPUT') {
            if (this.props.title !== this.state.title) {
                this.props.toggleSecTitleEdit(this.props.sec_idx, this.state.title)
            }
        }
        this.setState({ title_editing: !this.state.title_editing })
    }

    render() {
        return (
            <div className={sty['section-name-wrapper']}>
                <AutosizeInput
                    inputClassName={sty['section-name']}
                    minWidth={'10px'}
                    value={this.state.title}
                    placeholder={'untitled section'}
                    onChange={this.editLocalSecTitle}
                    onBlur={this.toggleSecTitleEdit}
                />
            </div>
        )
    }
}
/** 
                {
                    !this.props.editing ?
                        <div
                            className={sty['section-name']}
                            onClick={this.props.toggleSecTitleEdit}
                        >
                            {
                                this.props.name !== '' ? // if name is not empty
                                    this.props.name :
                                    <span className={sty['div-placeholder']}>field name</span>
                            }
                        </div> :
                        <input
                            className={sty['section-name']}
                            value={this.props.name}
                            placeholder={'field name'}
                            onChange={this.props.editLocalSecTitle}
                            onBlur={this.props.toggleSecTitleEdit}
                            ref={(input) => { input ? input.focus() : {} }}
                        />
                }
                */
export default SectionTitle