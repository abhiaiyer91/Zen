const deleteTodo = (id) => {
  return {
    type: 'DELETE_TODO',
    data: {
      id: id
    }
  }
};

module.exports = deleteTodo;
