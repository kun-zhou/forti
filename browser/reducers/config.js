export default function configReducer(config, action) {
    switch (action.type) {
        case 'UPDATE_CONFIG':
            return config.merge(config, {
                categories: action.categories,
                listOfDB: action.listOfDB,
                lastAccessed: action.lastAccessed
            })
        default:
            return config
    }
}