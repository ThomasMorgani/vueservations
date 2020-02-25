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
    console.log(targetObj, queryText)
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
  }
}
