import React from 'react'
import sty from '../sty.cssm'

class SettingsIcon extends React.PureComponent {
    render() {
        var setting_icon = this.props.setting_shown ?
            <div className={sty['field-setting']}><i className='fal fa-cog fa-fw' /></div> :
            null
    }
}