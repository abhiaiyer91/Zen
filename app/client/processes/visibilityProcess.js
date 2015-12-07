/**
 * This action processor sets the visibility on todo items
 * @param state
 * @param action
 * @returns {*}
 */
const TodoActions = new ZenAction(['todoActions']);

const visibilityFilter = (state = {}, action = {}) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      TodoActions.setVisibility(state, action);
      return state.findOne().visibility;
    default:
      return state;
  }
};

module.exports = visibilityFilter;
