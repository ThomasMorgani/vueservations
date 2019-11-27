export default {
  categoryByKey(categories, key) {
    let cat = categories.find(cat => cat.id === key);
    return cat.id;
  },
  categoryById(id, categories) {
    let cat = categories.find(cat => cat.id === id);
    return cat;
  }
};
