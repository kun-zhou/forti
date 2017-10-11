import React from 'react'
import css from './setup.cssm'
import config from '../../utils/config'
import SelectDB from './selectDB.jsx'
import DBFocused from './dbFocused.jsx'
class Setup extends React.PureComponent {
    render() {
        console.log(this.props.status.toJS())
        switch (this.props.status.get('context')) { // i.e., LOCKED
            case 'NO_CONFIG':
            case 'DEFAULT':
                return <DBFocused {...this.props} />
            default:
                return <SelectDB {...this.props} />
        }
    }
}
export default Setup