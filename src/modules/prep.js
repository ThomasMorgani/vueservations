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

export { catalogItem, hotspot }
