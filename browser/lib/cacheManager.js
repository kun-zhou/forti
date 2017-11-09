import _ from 'lodash'
import hashbow from 'hashbow'

var cache = null
var lastBumped = null

function init(_cache) {
    cache = _cache
}
// Accepts list of tags or singleton

function addTagToManifest(tags) { // receive array of tag
    if (tags.constructor === Array) {
        for (var tag of tags) {
            cache.manifest.tags.set(tag, hashbow(tag))
        }
    } else { // tags really just tag
        cache.manifest.tags.set(tags, hashbow(tags))
    }
}

function addCategoryToManifest(category, icon) { // receive array of tag
    cache.categories.set(category, icon)

}

// Return tags, categories added
function updateSecret(info) { // add or modify

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
    }
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
        return [[], []]
    }
    var secrets = [[], []]
    var abstract
    for (var key of keys) {
        abstract = cache.abstracts[key]
        if (abstract.favorite)
            secrets[0].push(abstract)
        else
            secrets[1].push(abstract)
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