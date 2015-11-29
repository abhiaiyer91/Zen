const todo = (state = {}, action = {}, collection = {}) => {
  switch (action.type) {
    case 'TOGGLE_TODO':
      if (state.id !== action.data.id) {
        return state;
      }
      return collection.update({'todos.id': action.data.id}, {$set: {'todos.$.completed': !state.completed}});
    default:
      return state;
  }
};

module.exports = todo;
