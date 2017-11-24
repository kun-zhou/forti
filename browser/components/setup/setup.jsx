import React from 'react'
import sty from './setup.cssm'

import SelectDB from './selectDB.jsx'
import WelcomePage from './welcomePage.jsx'

class Setup extends React.PureComponent {
    render() {
        switch (this.props.context) { // i.e., LOCKED
            case 'WELCOME':
                return <WelcomePage {...this.props} />
            case 'WELCOME_BACK':
                return <SelectDB {...this.props} />
            default:


        }
    }
}
export default Setup