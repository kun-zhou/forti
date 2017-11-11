// Uses immutbale data types
import hashbow from 'hashbow'
import { Map } from 'immutable'
var cache = null
var lastBumped = null

function init(_cache) {
    cache = _cache
    console.log(cache.toJS())
}
// Accepts list of tags or singleton
function getCategoryCounts() {
    var categories_count = Map()
    for (let category of cache.get('categories').keys()) {
        categories_count.set(category, cache.getIn('categories', category).size)
    }
    return categories_count
}

function getTags() {
    return cache.get('tags').keys()
}

function addSecret(secret) {
    // 1. Update Listing
    cache.all.unshift(secret.id)
    if (!cache.categories[secret.category])
        cache.categories[secret.category] = []
    cache.categories[secret.category].unshift(secret.id)
    // 2. Add to abstracts
    cache.abstracts[secret.id] = _.pick(secret, ['id', 'trash', 'title', 'attchment', 'snippet', 'tags', 'category', 'favorite'])
}

function updateMeta(secret) {
    cache.abstracts[secret.id] = _.pick(secret, ['id', 'trash', 'title', 'attchment', 'snippet', 'tags', 'category', 'favorite'])
}
// Return tags, categories added
function updateSecret(info) { // add or modify
    cache.setIn(['abstracts', info.get('id')],
        info.filter((value, key) => {
            ['id', 'trash', 'title', 'attchment', 'snippet', 'tags', 'category', 'favorite'].includes(key)
        })
    )
    /*
    var prev_abstract = cache.abstracts[info.id]
    // 1. UPDATING LIST
    // 1. If from all to trash (trash)
    if (!prev_abstract.trash && info.trash) {
        // remove the entry from all listings and add to trash listing
        // when trashes, favorite is deleted
        _.remove(cache.favorites, (id) => id === info.id)
        _.remove(cache.all, (id) => id === info.id)
        _.remove(cache.categories[prev_abstract.category], (id) => id === info.id)
        for (let tag of prev_abstract.tags) {
            _.remove(cache.tags[tag], (id) => id === info.id)
            if (cache.tags[tag].length === 0) {
                cache.manifest.tags.delete(tag)
            }
        }
        cache.trash.unshift(info.id)
    }
    // 2. If recovers from trash
    if (prev_abstract.trash && !info.trash) {
        // 1. Update favorite
        if (prev_abstract.favorite) {
            cache.favorites.unshift(info.id)
        }
        // 2. update categories
        // add category if not existent
        if (!cache.categories[prev_abstract.category]) {
            cache.categories[prev_abstract.category] = []
        }
        // 3. update tags
        for (let tag of prev_abstract.tags) {
            if (!cache.tags[tag]) { // if tag does not exit
                cache.tags[tag] = []
            }
            cache.tags[tag].unshift(info.id)
        }
        cache.categories[prev_abstract.category].unshift(info.id)
    }
    // 3. If trash to trash, do noting about lists
    // 4. If all to all
    if (!prev_abstract.trash && !info.trash) {
        // update favorites if necessary
        if (prev_abstract.favorite !== info.favorite) {
            if (prev_abstract.favorite) {
                _.remove(cache.favorites, (id) => id === info.id)
            } else {
                cache.favorites.unshift(info.id)
            }
        }
        // update tags
        var removedTags = _.difference(prev_abstract.tags, info.tags)
        for (let tag of removedTags) {
            _.remove(cache.tags[tag], (id) => id === info.id)
        }
        var addedTags = _.difference(info.tags, prev_abstract.tags)
        for (let tag of addedTags) {
            if (!cache.tags[tag]) { // if tag does not exit

                cache.tags[tag] = []
            }
            cache.tags[tag].unshift(info.id)
        }
    }*/

}
// This function does not change the list
function updateSecretInfoOnly(info) {
    var prev_abstract = cache.abstracts[info.id]
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

function appendAbstracts(keys) {
    var secrets = Map({ favorites: List(), others: List() })
    if (!keys) { // if undefined
        return secrets
    }
    var abstract
    secrets.withMutations((secrets) => {
        for (var key of keys) {
            abstract = cache.getIn(['abstracts', key])
            if (abstract.get('favorite'))
                secrets.update('favorites', favs => favs.push(abstract))
            else
                secrets.update('favorites', favs => favs.push(abstract))
        }
    })
    return secrets
}

export default {
    init,
    updateMeta,
    getTags,
    getCategoryCounts,
    updateSecret,
    trashSecret,
    getEntries,
    getCache,
    addSecret
}