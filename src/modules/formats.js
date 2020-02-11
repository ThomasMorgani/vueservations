//TODO: WHEN SETTINGS ARE SETUP, IMPORT DEFAULTS, DONT HARDCODE

const catalogItem = item => {
  return {
    abbreviation: item.abbreviation || 'EIPL',
    category: item.category || null,
    categoryName: item.categoryName || 'MISC',
    color: item.color || null,
    customFields:
      item.custom_fields && item.custom_fields.length > 0
        ? item.custom_fields
        : null,
    description: item.description || '',
    id: item.id,
    image_data: item.image_data || {},
    lastReservation:
      item.lastReservation && item.lastReservation['0']
        ? item.lastReservation['0']
        : null,
    name: item.name || '',
    status: item.status || ''
  }
}

const hotspot = item => {
  return {
    abbreviation: item.abbreviation || 'EIPL',
    categoryName: item.categoryName || 'MISC',
    description: item.description || '',
    id: item.id,
    name: item.name || '',
    status: item.status || ''
  }
}

const timestampHuman = (timestamp, withYear = true, withTime = true) => {
  const asDate = new Date(timestamp)
  let human = ''
  let D = asDate.getDate()
  if (D < 10) {
    D = D.toString().padStart(2, '0')
  }
  let M = asDate.getMonth() + 1
  if (M < 10) {
    M = M.toString().padStart(2, '0')
  }
  human = `${M}/${D}`
  if (withYear) {
    human = human + '/' + asDate.getFullYear()
  }
  if (withTime) {
    let h = asDate.getHours()
    let m = asDate.getMinutes()
    let ampm = 'AM'
    if (h === 0) {
      h = 12
    }
    if (h > 12) {
      h = h - 12
      ampm = 'PM'
    }
    if (m < 10) {
      m = m.toString().padStart(2, '0')
    }
    human = human + `  ${h}:${m} ${ampm}`
  }
  return human
  // return timestamp`
}

export { catalogItem, hotspot, timestampHuman }
