const setVisibility = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter: filter
  }
};

module.exports = setVisibility;
