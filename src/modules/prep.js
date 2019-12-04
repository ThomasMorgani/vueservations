//TODO: WHEN SETTINGS ARE SETUP, IMPORT DEFAULTS, DONT HARDCODE

const catalogItem = item => {
  return {
    abbreviation: item.abbreviation || 'EIPL',
    categoryName: item.categoryName || 'MISC',
    description: item.description || '',
    id: item.id,
    name: item.name || '',
    status: item.status || ''
  };
};

const hotspot = item => {
  return {
    abbreviation: item.abbreviation || 'EIPL',
    categoryName: item.categoryName || 'MISC',
    description: item.description || '',
    id: item.id,
    name: item.name || '',
    status: item.status || ''
  };
};

export { catalogItem, hotspot };
