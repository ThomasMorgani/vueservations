import Moment from 'moment'
import filters from '@/modules/filters.js'

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
    internal: item.internal || '0',
    isAvailable: item.isAvailable,
    lastReservation:
      item.lastReservation && item.lastReservation['0']
        ? item.lastReservation['0']
        : null,
    name: item.name || '',
    notes: item.notes || [],
    reservation_buffer: item.reservation_buffer || null,
    reservation_length: item.reservation_length || null,
    status: item.status || ''
  }
}

const cfCiValuesSimple = (fieldId, catalogItems) => {
  const items = []
  catalogItems.forEach(ci => {
    if (ci.custom_fields && ci.custom_fields.length > 0) {
      let fieldMatch = ci.custom_fields.find(f => f.field_id == fieldId)
      if (fieldMatch !== undefined) {
        items.push({
          ci_id: ci.id,
          ci_name: ci.name,
          field_value: fieldMatch.value || ''
        })
      }
    }
  })
  return items
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

const eventDetailed = (event, catalogItems, patrons) => {
  // console.log('eventDetailedeventDetailedeventDetailed')
  // console.log(event)
  return {
    ...event,
    ciData: filters.getObjectFromArray(catalogItems, 'id', event.item_id), //
    patronData: filters.getObjectFromArray(patrons, 'id', event.patron_id)
  }
}

const eventListSimple = (events, patrons) => {
  const currYear = new Date().getFullYear().toString()
  return events.map(e => {
    const patron = patrons.find(p => p.id === e.patron_id)
    const showYear = currYear !== e.start_date.substr(0, 4)
    const eTime = new Date(e.start_date).getTime()
    const newEvent = {
      patron: patron
        ? `${patron.last_name}, ${patron.first_name}`
        : 'UNK PATRON',
      startDate: timestampHuman(e.start_date, showYear, false),
      endDate: timestampHuman(e.end_date, showYear, false),
      startTime: eTime
    }
    return newEvent
  })
}

const eventPreview = (event, categories) => {
  console.log(event)
  console.log(categories)
  if (typeof event !== 'object') return
  event = event?.event ? { ...event.event } : { ...event }
  const data = {
    details: {
      color: event.ciData.color || 'primary',
      id: event.id,
      title: event.ciData.name || 'Event Details'
    },
    eventData: event,
    fields: {
      First: event.patronData.first_name || '',
      Last: event.patronData.last_name || '-',
      Start: timestampHuman(event.start_date, true, false) || '-',
      End: timestampHuman(event.end_date, true, false) || '-',
      Length: dateDifference(event.start_date, event.end_date) + ' Days',
      Note:
        event.notes && Array.isArray(event.notes) ? event.notes[0] : event.notes
    }
  }
  return data
}

const noteListSimple = notes => {
  return notes.map(e => {
    const newNote = {
      id: e.id || null,
      note: e.note,
      date_created: timestampHuman(e.date_created, true, false),
      date_updated: timestampHuman(e.date_updated, true, false)
    }
    return newNote
  })
}

const patronHistorySimple = (events, catalogItems) => {
  return events.map(e => {
    const ci = catalogItems.find(ci => ci.id == e.item_id)
    const newHistory = {
      id: e.id || null,
      catalog_item: ci.name,
      start_date: timestampHuman(e.start_date, true, false),
      end_date: timestampHuman(e.end_date, true, false)
    }
    return newHistory
  })
}

const timeHuman = time => {
  const timeArr = time.split(':')
  let period = 'am'
  let hour = parseInt(timeArr['0'])
  let min = parseInt(timeArr['1'])
  if (hour >= 12) period = 'pm'
  if (hour > 12) hour = hour - 12
  return `${hour.toString().padStart(2, '0')}:${min
    .toString()
    .padStart(2, '0')}${period}`
}

const timestampHuman = (timestamp, withYear = true, withTime = true) => {
  const asDate =
    timestamp && typeof timestamp.getMonth === 'function'
      ? timestamp
      : new Date(timestamp)
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

export {
  catalogItem,
  cfCiValuesSimple,
  dateDifference,
  eventDetailed,
  eventListSimple,
  eventPreview,
  noteListSimple,
  patronHistorySimple,
  timeHuman,
  timestampHuman
}
