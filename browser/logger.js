import { createLogger } from 'redux-logger'
import Immutable from 'immutable'
const logger = createLogger({
    stateTransformer: (state) => {
        return state.toJS()
    }
})

export default logger
