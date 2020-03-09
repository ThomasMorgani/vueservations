import Moment from 'moment'
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
    isAvailable: item.isAvailable,
    lastReservation:
      item.lastReservation && item.lastReservation['0']
        ? item.lastReservation['0']
        : null,
    name: item.name || '',
    notes: item.notes || [],
    status: item.status || ''
  }
}



const dateDifference = (date1, date2) => {
  //TODO: need to extend? pass units needed, days, hours, etc
  //need choice return string or number?

  let dateA = typeof date1.getMonth === 'function' ? date1 : new Date(date1)
  let dateB = typeof date2.getMonth === 'function' ? date2 : new Date(date2)

  dateA = Moment(dateA)
  dateB = Moment(dateB)
  const diff = Math.abs(dateA.diff(dateB))

  const total_seconds = parseInt(Math.floor(diff / 1000))
  const total_minutes = parseInt(Math.floor(total_seconds / 60))
  const total_hours = parseInt(Math.floor(total_minutes / 60))
  const total_days = parseInt(Math.floor(total_hours / 24))

  return total_days
}
const eventListSimple = (events, patrons) => {
  return events.map(e => {
    const patron = patrons.find(p => p.id === e.patron_id)
    const newEvent = {
      patron: patron
        ? `${patron.last_name}, ${patron.first_name}`
        : 'UNK PATRON',
      startDate: timestampHuman(e.start_date, false, false),
      endDate: timestampHuman(e.end_date, false, false)
    }
    return newEvent
  })
}

const noteListSimple = (notes) => {
  return notes.map(e => {
    const newNote = {
      note: e.note,
      createdDate: timestampHuman(e.date_created, false, false),
      updatedDate: timestampHuman(e.date_updated, false, false)
    }
    return newNote
  })
}

const timestampHuman = (timestamp, withYear = true, withTime = true) => {
  const asDate = typeof timestamp.getMonth === 'function' ? timestamp : new Date(timestamp)
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

export { catalogItem, dateDifference, eventListSimple, noteListSimple, timestampHuman }
