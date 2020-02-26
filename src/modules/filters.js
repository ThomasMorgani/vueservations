import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)
export default {
  categoryByKey(categories, key) {
    let cat = categories.find(cat => cat.id === key)
    return cat.id
  },
  categoryById(id, categories) {
    let cat = categories.find(cat => cat.id === id)
    return cat
  },
  customfieldByCustomValue(key, value, customFields) {
    let field = customFields.find(field => field[key] === value)
    return field
  },
  customfieldById(id, customFields) {
    let field = customFields.find(field => field.id === id)
    return field
  },
  findStringMatchesInObj(targetObj, keysArr, queryText) {
    let pass = false
    keysArr.forEach(key => {
      if (targetObj[key]) {
        let str = targetObj[key].toLowerCase()
        if (str.indexOf(queryText.toLowerCase()) > -1) {
          pass = true
        }
      }
    })
    return pass
  },
  getObjectFromArray(arr, key, val, returnVal = false) {
    //return item from obj where key === val
    if (!Array.isArray(arr)) {
      console.log('error: expected array as first paramater. Received:')
      console.log(arr)
      return false
    } else {
      const result = arr.find(el => el[key] === val)
      // console.log(result)
      return returnVal ? result[returnVal] : result
    }
  },
  testRangeOverlap(startDate1, endDate1, startDate2, endDate2) {
    let searchStartDate1 = new Date(startDate1)
    let searchEndDate1 = new Date(endDate1)
    //THIS IS FOR CUSTOM BUFFER PERIODS
    //TODO: make this a setting
    searchStartDate1.setDate(searchStartDate1.getDate() - 1)
    searchEndDate1.setDate(searchEndDate1.getDate() + 2)
    const searchRange1 = moment.range(searchStartDate1, searchEndDate1)

    const searchStartDate2 = new Date(startDate2)
    const searchEndtDate2 = new Date(endDate2)
    const searchRange2 = moment.range(searchStartDate2, searchEndtDate2)

    return searchRange1.overlaps(searchRange2, { adjacent: true })
  }
}
