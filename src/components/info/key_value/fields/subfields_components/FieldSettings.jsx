import React from 'react'
import sty from '../../sty.cssm'
import Dropdown from 'public/components/Dropdown/dropdown.jsx'
class FieldSettings extends React.Component {
    render() {
        return (
            <div
                className={sty['field-setting']}
            >
                <Dropdown entries={['delete', 'to code']} button={<i className='fal fa-fw fa-lg fa-cog' />} />
            </div>
        )
    }
}

export default FieldSettings