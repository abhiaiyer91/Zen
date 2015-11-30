/**
 * Function to help dispatch the add todo procedure
 * @param text
 * @returns {{id: number, type: string, data: {id: *, text: *, completed: boolean}}}
 */
const addTodo = (text) => {
  return {
    id: 1,
    type: 'ADD_TODO',
    data: {
      id: Random.id(),
      text: text,
      completed: false
    }
  }
};

module.exports = addTodo;
