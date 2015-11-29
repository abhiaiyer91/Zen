import todo from './todoProcess';

/**
 * This is our action processor. It takes the current state and process actions on the state
 * @param state
 * @param action
 * @returns {*}
 */
const todos = (state = {}, action = {}) => {
  switch (action.type) {
    case 'ADD_TODO':
      return state.update({}, {$push: {todos: action.data}});
    case 'TOGGLE_TODO':
      let currentTodos = state.findOne().todos;
      return currentTodos.map(t => todo(t, action, state));
    case 'DELETE_TODO':
      return state.update({}, {$pull: {'todos': {id: action.data.id}}});
    default:
      return state;
  }
};

module.exports = todos;
