const TodoActions = new ZenAction(['todoActions']);
const todo = (state = {}, action = {}, collection = {}) => {
  switch (action.type) {
    case 'TOGGLE_TODO':
      if (state.id !== action.data.id) {
        return state;
      }
      return TodoActions.toggleTodo(collection, state, action);
    default:
      return state;
  }
};

module.exports = todo;
