import React from 'react'
import sty from './setup.cssm'

import SelectDB from './selectDB.jsx'
import WelcomePage from './welcomePage.jsx'

class Setup extends React.PureComponent {
    render() {
        console.log(this.props.status.toJS())
        switch (this.props.status.get('context')) { // i.e., LOCKED
            case 'NO_CONFIG':
                return <WelcomePage {...this.props}/>
            case 'WELCOME':
                return <SelectDB {...this.props} />
            default: return null
        }
    }
}
export default Setup