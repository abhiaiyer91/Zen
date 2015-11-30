const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    data: {
      id: id
    }
  }
};

module.exports = toggleTodo;
