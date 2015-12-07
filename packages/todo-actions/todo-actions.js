ZenMixins.registerMixin('todoActions', {
  addTodo(state, action) {
    return state.update({}, {$push: {todos: action.data}});
  },
  toggleTodo(store, currentState, action) {
    return store.update({'todos.id': action.data.id}, {$set: {'todos.$.completed': !currentState.completed}});
  },
  deleteTodo(state, action) {
    return state.update({}, {$pull: {'todos': {id: action.data.id}}});
  },
  setVisibility(state, action) {
    return state.update({}, {$set: {visibility: action.filter}});
  }
});
