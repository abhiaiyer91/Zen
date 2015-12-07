import todo from './todoProcess';
const TodoActions = new ZenAction(['todoActions']);
/**
 * This is our action processor. It takes the current state and process actions on the state
 * @param state
 * @param action
 * @returns {*}
 */
const todos = (state = {}, action = {}) => {
  switch (action.type) {
    case 'ADD_TODO':
      return TodoActions.addTodo(state, action);
    case 'TOGGLE_TODO':
      let currentTodos = state.findOne().todos;
      return currentTodos.map(t => todo(t, action, state));
    case 'DELETE_TODO':
      return TodoActions.deleteTodo(state, action);
    default:
      return state;
  }
};

module.exports = todos;
