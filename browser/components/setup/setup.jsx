import React from 'react'
import sty from './setup.cssm'

import SelectDB from './selectDB.jsx'
import WelcomePage from './welcomePage.jsx'

class Setup extends React.PureComponent {
    render() {
        switch (this.props.status) { // i.e., LOCKED
            case 'WELCOME':
                return <WelcomePage {...this.props} />
            case 'SELECT_DB':
            default:
                return <SelectDB {...this.props} />
        }
    }
}
export default Setup