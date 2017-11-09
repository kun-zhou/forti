import React from 'react'
import sty from './sty.cssm'
import AutosizeInput from './AutosizeInput.jsx'
class SectionHeader extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className={sty['section-name-wrapper']}>
                <AutosizeInput
                    inputClassName={sty['section-name']}
                    minWidth={'10px'}
                    value={this.props.title}
                    placeholder={'untitled section'}
                    onChange={this.props.editLocalSecTitle}
                    onBlur={this.props.toggleSecTitleEdit}
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
export default SectionHeader