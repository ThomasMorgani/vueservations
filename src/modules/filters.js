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
  findStringMatchesInObj(targetObj = false, keysArr, queryText) {
    if (targetObj?.constructor.name !== 'Object') return false
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
      return false
    } else {
      const result = arr.find(el => el[key] == val)
      return returnVal ? result[returnVal] : result
    }
  },
  isAllDay(timestamp1, timestamp2) {
    if (!timestamp1 || !timestamp2) return false
    const timeOne = timestamp1.split(' ')[1] || timestamp1
    const timeTwo = timestamp2.split(' ')[1] || timestamp2
    return (
      timeOne.substring(0, 5) === '00:00' && timeTwo.substring(0, 5) === '00:00'
    )
  },
  testRangeOverlap(startDate1, endDate1, startDate2, endDate2, buffer) {
    for (let arg of arguments) {
      if (arg === undefined) return false
    }
    buffer = parseInt(buffer)
    if (isNaN(buffer)) buffer = 0
    // DATES 1
    let searchStartDate1 =
      typeof startDate1.getMonth === 'function'
        ? startDate1
        : new Date(startDate1)
    let searchEndDate1 =
      typeof endDate1.getMonth === 'function' ? endDate1 : new Date(endDate1)
    //THIS IS FOR CUSTOM BUFFER PERIODS
    //TODO: make this a setting
    searchStartDate1.setDate(searchStartDate1.getDate() - buffer)

    // DATES 2
    let searchStartDate2 =
      typeof startDate2.getMonth === 'function'
        ? startDate2
        : new Date(startDate2)
    let searchEndDate2 =
      typeof endDate2.getMonth === 'function' ? endDate2 : new Date(endDate2)
    searchEndDate1.setDate(searchEndDate1.getDate() + buffer)

    const searchRange1 = moment.range(searchStartDate1, searchEndDate1)
    const searchRange2 = moment.range(searchStartDate2, searchEndDate2)

    return searchRange1.overlaps(searchRange2, { adjacent: buffer })
  }
}
