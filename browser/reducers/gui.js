/**
 * Manages the GUI, and anything that does not directly change the database itself.
 */

import { fromJS, List, Map } from 'immutable'

export default function guiReducer(gui, action) {
  switch (action.type) {
    case 'NAV_ENTRY_CLICK':
      return gui.merge({
        activePane: 'nav',
        activeNavTab: action.sNavTab, // s shorthand for selected
        activeNavTabType: action.sNavTabType,
        activeEntries: action.entries,
        activeInfo: null
      })
    case 'ENTRY_CLICK':
      return gui.merge({
        activePane: 'entries',
        activeInfo: action.info,
        activeIdxInList: action.idx
      })
    case 'UPDATE_META':
      switch (action.operation) {
        // need to handle the sepcial case of tags since it is a List but only the tag updated or delested is reported
        case 'ADD_TAG':
          var new_value = gui.getIn(['activeInfo', 'tags'])
            .push(action.params.new_value)
          break
        case 'DELETE_TAG':
          var new_value = gui.getIn(['activeInfo', 'tags'])
            .filter((tag) => tag !== action.params.new_value)
          break
        default:
          var new_value = action.params.new_value
      }
      gui = gui.setIn(['activeInfo', action.params.key], new_value)
      return gui
    case 'UPDATE_CUSTOM':
      var params = action.params
      switch (action.operation) {
        case 'ADD_SECTION':
          return gui
            .setIn(['activeInfo', 'sections', action.new_id], fromJS({
              title: '',
              field_order: [],
              fields: {}
            }))
            .updateIn(['activeInfo', 'section_order'], (list) => list.push(action.new_id))
        case 'UPDATE_SECTION_TITLE':
          return gui
            .setIn(['activeInfo', 'sections', params.sec_id, 'title'], params.new_value)
        case 'UPDATE_FIELD':
          return gui
            .setIn(['activeInfo', 'sections', params.sec_id, 'fields', params.field_id, params.content_id],
            params.new_value)
        case 'DELETE_FIELD':
          gui = gui
            .deleteIn(['activeInfo', 'sections', params.sec_id, 'fields', params.field_id])
            .updateIn(['activeInfo', 'sections', params.sec_id, 'field_order'], field_order =>
              field_order.filter((field_id) => field_id !== params.field_id)
            )
          if (gui.getIn(['activeInfo', 'sections', params.sec_id, 'fields']).size === 0) {
            gui = gui
              .updateIn(['activeInfo', 'section_order'], (list) => list.filter((id) => id !== params.sec_id))
              .deleteIn(['activeInfo', 'sections', params.sec_id])
          }
          return gui
        case 'ADD_FIELD':
          return gui
            .updateIn(['activeInfo', 'sections', params.sec_id, 'field_order'], field_order => field_order.push(action.new_id))
            .setIn(['activeInfo', 'sections', params.sec_id, 'fields', action.new_id], Map({ key: '', value: '', type: 'text' }))
        default:
          throw 'invalid operation fired on UPDATE_CUSTOM'
      }
    case 'DELETE_SECRET':
      return gui
        .set('activeInfo', null)
        .deleteIn(['activeEntries', gui.get('activeIdxInList')])
    case 'SEARCH_COMPLETED':
      return gui.set('activeEntries', action.search_results)
    case 'DEACTIVATE_SEARCH':
      return gui.merge({
        activeEntries: action.entries
      })
    default:
      return gui
  }
}
