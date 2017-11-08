
var cache = null

function init(_cache) {
    cache = _cache
}

function updateSecret() { // add or modify

}

function trashSecret() {

}

function getCache() {
    return cache
}

function getEntries(type, name, sort) {
    switch (type) {
        case 'all':
            return appendAbstracts(cache.all)
        case 'favorite':
            return appendAbstracts(cache.favorites)
        case 'category':
            return appendAbstracts(cache.categories[name])
        case 'tag':
            return appendAbstracts(cache.tags[name])
        case 'trash':
            return appendAbstracts(cache.trash)
        default:
            return null
    }
}

function appendAbstracts(keys) {
    if (!keys) {
        return []
    }
    var secrets = []
    for (var key of keys) {
        secrets.push(cache.abstracts[key])
    }
    return secrets
}

export default {
    init,
    updateSecret,
    trashSecret,
    getEntries,
    getCache
}