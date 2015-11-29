import React from 'react';
import TodoItem from './TodoItem';


const TodoList = ({
  todos,
  onDeleteClick,
  onToggleClick
  }) => (
  <div>
    {todos.map(todo => <TodoItem key={todo.id} onToggle={onToggleClick} onDelete={onDeleteClick} item={todo}/>)}
  </div>
);

module.exports = TodoList;
