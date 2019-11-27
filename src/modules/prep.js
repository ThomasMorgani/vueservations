//TODO: WHEN SETTINGS ARE SETUP, IMPORT DEFAULTS, DONT HARDCODE
export default {
  default(item) {
    return {
      name: item.name || 'unk'
    };
  },
  hotspot(item) {
    return {
      abbreviation: item.abbreviation || 'EIPL',
      categoryName: item.categoryName || 'MISC',
      description: item.description || '',
      id: item.id,
      name: item.name || '',
      status: item.status || ''
    };
  }
};
