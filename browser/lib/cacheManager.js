// Uses immutbale data types
import { Map, List, fromJS, toJS } from 'immutable'
var cache = null
var lastBumped = null

function init(_cache) {
    cache = _cache
}
// Accepts list of tags or singleton
function getCategoryCounts() {
    var categories_count = Map()
    for (let category of cache.get('categories').keys()) {
        categories_count = categories_count.set(category, cache.getIn(['categories', category]).size)
    }
    return categories_count
}

function updateTagsListing() {
    cache = cache.update('tags', tags => tags.filter((list, tag) => list.size > 0))
}

function getTags() {
    return cache.get('tags').keySeq()
}

function addSecret(secret) {
    // 1. Update Listing
    cache = cache.update('all', all => all.unshift(secret.get('id')))
    if (!cache.getIn(['categories', secret.get('category')]))
        cache = cache.setIn(['categories', secret.get('category')], List())
    cache = cache.updateIn(['categories', secret.get('category')], list => list.unshift(secret.get('id')))
    // 2. Add to abstracts
    cache = cache.setIn(['abstracts', secret.get('id')], secret.filter((value, key) =>
        ['id', 'trash', 'title', 'attchment', 'snippet', 'tags', 'category', 'favorite'].includes(key)
    ))
}

// Return tags, categories added
function updateSecret(id, action) { // add or modify
    // update listings
    // update tags if necessary
    var new_value = action.params.new_value
    switch (action.operation) {
    // need to handle the sepcial case of tags since it is a List but only the tag updated or delested is reported
    case 'ADD_TAG':
        cache = cache.updateIn(['abstracts', id, 'tags'], tags => tags.push(new_value))
        cache = cache.updateIn(['tags', new_value], (tag) => {
            return !tag ? List([id]) : tag.push(id)
        })
        updateTagsListing()
        break
    case 'DELETE_TAG':
        cache = cache.updateIn(['abstracts', id, 'tags'], tags => tags.filter((tag) => tag !== new_value))
        cache = cache.updateIn(['tags', new_value], (tag) => {
            return !tag ? List([id]) : tag.filter((key) => key !== id)
        })
        updateTagsListing()
        break
    default:
        cache = cache.setIn(['abstracts', id, action.params.key], new_value)
    }
    if (action.operation === 'UPDATE_FAV') {
        cache = new_value ? cache.update('favorites', favs => favs.unshift(id)) : cache.update('favorites', favs => favs.filter(key => key !== id))
    }
}

function trashSecret() {

}

function getCache() {
    return cache
}

function getEntries(type, name, sort) {
    switch (type) {
    case 'all':
        return appendAbstracts(cache.get('all'))
    case 'favorite':
        return appendAbstracts(cache.get('favorites'))
    case 'category':
        return appendAbstracts(cache.getIn(['categories', name]))
    case 'tag':
        return appendAbstracts(cache.getIn(['tags', name]))
    case 'trash':
        return appendAbstracts(cache.get('trash'))
    default:
        return null
    }
}

function deleteSecret(_id) {
    // update listing
    cache = cache.withMutations((cache) => {
        var favorite = cache.getIn(['abstracts', _id, 'favorite'])
        var category = cache.getIn(['abstracts', _id, 'category'])
        var tags = cache.getIn(['abstracts', _id, 'tags'])

        // all
        cache.update('all', all => all.filter((id) => id !== _id))
        // favorite
        if (favorite) {
            cache.update('favorites', favs => favs.filter((id) => id !== _id))
        }
        // category
        cache.updateIn(['categories', category], keys => keys.filter(id => id !== _id))
        //tag
        tags.forEach((tag) => {
            cache.updateIn(['tags', tag], keys => keys.filter(id => id !== _id))
        })
        // delete tags if they have disappeared
    })
    updateTagsListing()
    // delete tag and category if no more

    // delete entry
    cache = cache.deleteIn(['abstracts', _id])
}

function searchInTab(type, name, keywords) {
    switch (type) {
    case 'all':
        return search(cache.get('all'), keywords)
    case 'favorite':
        return search(cache.get('favorites'), keywords)
    case 'category':
        return search(cache.getIn(['categories', name]), keywords)
    case 'tag':
        return search(cache.getIn(['tags', name]), keywords)
    case 'trash':
        return search(cache.get('trash'), keywords)
    default:
        return null
    }
}

function search(ids, keywords) {
    var keywords = keywords.split(/\s+/)
    var results = []
    ids.forEach((id) => {
        var match = keywords.reduce((acc, keyword) => {
            var abstract = cache.getIn(['abstracts', id])
            return acc + Number(abstract.get('title').includes(keyword) || abstract.get('snippet').includes(keyword))
        }, 0)

        if (match === keywords.length) {
            results.push(id)
        }
    })
    return appendAbstracts(results)
}

function appendAbstracts(keys) {
    var secrets = List()
    if (!keys) {
        return secrets
    }
    secrets = secrets.withMutations((secrets) => {
        keys.forEach((key) => {
            secrets.push(cache.getIn(['abstracts', key]))
        })
    })
    return secrets
}

export default {
    init,
    getTags,
    getCategoryCounts,
    searchInTab,
    updateSecret,
    trashSecret,
    deleteSecret,
    getEntries,
    getCache,
    addSecret
}