
export function genUniqueId(length, existingIds) {
    do { // 9 is good
        var id = require('crypto').randomBytes(length).toString('base64')
    } while (existingIds.includes(id))
    return id
}

export function getKeysLoc(navTabType, navTab) {
    var location //an array representing location in db state
    switch (navTabType) {
        case 'all':
            location = ['db', 'all_keys']; break
        case 'favorites':
            location = ['db', 'favorites_keys']; break
        case 'categories':
            location = ['db', 'categories_keys', navTab]; break
        case 'tags':
            location = ['db', 'tags_keys', navTab]; break
        default:
            location = ['db', 'all_keys']
    }
    return location
}