/**
 * This action processor sets the visibility on todo items
 * @param state
 * @param action
 * @returns {*}
 */
const visibilityFilter = (state = {}, action = {}) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      console.log('Im being called')
      state.update({}, {$set: {visibility: action.filter}});
      return state.findOne().visibility;
    default:
      return state;
  }
};

module.exports = visibilityFilter;
