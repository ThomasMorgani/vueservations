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
      //console.log('error: expected array as first paramater. Received:')
      //console.log(arr)
      return false
    } else {
      const result = arr.find(el => el[key] === val)
      // //console.log(result)
      return returnVal ? result[returnVal] : result
    }
  },
  testRangeOverlap(
    startDate1,
    endDate1,
    startDate2,
    endDate2,
    withBuffer = true
  ) {
    // DATES 1
    let searchStartDate1 =
      typeof startDate1.getMonth === 'function'
        ? startDate1
        : new Date(startDate1)
    let searchEndDate1 =
      typeof endDate1.getMonth === 'function' ? endDate1 : new Date(endDate1)
    //THIS IS FOR CUSTOM BUFFER PERIODS
    //TODO: make this a setting
    if (withBuffer) {
      searchStartDate1.setDate(searchStartDate1.getDate() - 1)
      // searchEndDate1.setDate(searchEndDate1.getDate() + 2)
      searchEndDate1.setDate(searchEndDate1.getDate() + 1)
    }

    // searchStartDate1 = searchStartDate1.toISOString()
    // searchEndDate1 = searchEndDate1.toISOString()

    // DATES 2
    let searchStartDate2 =
      typeof startDate2.getMonth === 'function'
        ? startDate2
        : new Date(startDate2)
    let searchEndDate2 =
      typeof endDate2.getMonth === 'function' ? endDate2 : new Date(endDate2)

    // searchStartDate2 = searchStartDate2.toISOString()
    // searchEndDate2 = searchEndDate2.toISOString()

    // console.log(searchStartDate1)
    // console.log(searchEndDate1)
    // console.log(searchStartDate2)
    // console.log(searchEndDate2)

    const searchRange1 = moment.range(searchStartDate1, searchEndDate1)
    const searchRange2 = moment.range(searchStartDate2, searchEndDate2)

    // console.log(searchStartDate1)
    // console.log(searchStartDate2)
    // console.log(searchEndDate1)
    // console.log(searchEndDate2)

    // return searchRange1.overlaps(searchRange2, { adjacent: true })
    return searchRange1.overlaps(searchRange2, { adjacent: withBuffer })
  }
}
