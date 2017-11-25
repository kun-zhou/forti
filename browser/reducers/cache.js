/**
 * Manages the GUI, and anything that does not directly change the database itself.
 */

import { Map, List, fromJS } from 'immutable'
// TODO: UPDATE TAG LISTINGS
export default function cacheReducer(cache, action) {
    switch (action.type) {
        case 'ATTEMPT_UNLOCK':
            if (action.success) {
                return action.cache
            }
            return cache
        case 'CREATE_SECRET':
            var secret = action.new_secret
            return cache.withMutations((cache) => {
                cache.update('all', all => all.unshift(secret.get('id')))
                if (!cache.getIn(['categories', secret.get('category')]))
                    cache = cache.setIn(['categories', secret.get('category')], List())
                cache.updateIn(['categories', secret.get('category')], list => list.unshift(secret.get('id')))
                // 2. Add to abstracts
                cache.setIn(['abstracts', secret.get('id')], secret.filter((value, key) =>
                    ['id', 'trash', 'title', 'attchment', 'snippet', 'tags', 'category', 'favorite'].includes(key)
                ))
            })
        case 'UPDATE_META':
            var id = action.id
            var new_value = action.params.new_value
            switch (action.operation) {
                // need to handle the sepcial case of tags since it is a List but only the tag updated or delested is reported
                case 'ADD_TAG':
                    cache = cache.withMutations((cache) => {
                        cache.updateIn(['abstracts', id, 'tags'], tags => tags.push(new_value))
                        cache.updateIn(['tags', new_value], (tag) => {
                            return !tag ? List([id]) : tag.push(id)
                        })
                    })
                    cache = updateTagsListing(cache)
                    break
                case 'DELETE_TAG':
                    cache = cache.withMutations((cache) => {
                        cache.updateIn(['abstracts', id, 'tags'], tags => tags.filter((tag) => tag !== new_value))
                        cache.updateIn(['tags', new_value], (tag) => {
                            return !tag ? List([id]) : tag.filter((key) => key !== id)
                        })
                    })
                    cache = updateTagsListing(cache)
                    break
                default:
                    cache = cache.setIn(['abstracts', id, action.params.key], new_value)
            }
            if (action.operation === 'UPDATE_FAV') {
                cache = new_value ? cache.update('favorites', favs => favs.unshift(id)) : cache.update('favorites', favs => favs.filter(key => key !== id))
            }
            return cache
        case 'DELETE_SECRET':
            var _id = action.id
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
            return updateTagsListing(cache)
        default:
            return cache
    }
}


// Some helpers
function updateTagsListing(cache) {
    return cache.update('tags', tags => tags.filter((list, tag) => list.size > 0))
}