import React from 'react'
import sty from './setup.cssm'

import SelectDB from './selectDB.jsx'
import WelcomePage from './welcomePage.jsx'

class Setup extends React.PureComponent {
    constructor(props) {
        super()
        this.state = { context: props.status.get('welcome') ? 'WELCOME' : 'WELCOME_BACK' }
    }

    triggerWelcomeBack = () => {
        this.setState({ context: 'WELCOME_BACK' })
    }

    render() {
        switch (this.state.context) { // i.e., LOCKED
            case 'WELCOME':
                return <WelcomePage {...this.props} triggerWelcomeBack={this.triggerWelcomeBack} />
            case 'WELCOME_BACK':
                return <SelectDB {...this.props} />
            default:


        }
    }
}
export default Setup