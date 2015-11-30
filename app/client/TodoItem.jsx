import React from 'react';
/**
 * Stateless Component Function for Todo Item
 * @param item
 * @param onToggle
 * * @param onDelete
 * @returns {XML}
 * @constructor
 */
const TodoItem = ({item, onToggle, onDelete}) => {
  const completed = item.completed ? 'line-through' : 'none';
  const BtnText = {
    text: item.completed ? 'Redo' : 'Done',
    style: item.completed ? 'btn btn-danger' : 'btn btn-success'
  };
  const itemStyle = {
    textDecoration: completed
  };
  return (
    <div>
      <div className="flex-grid grid-center">
        <div className="grid-cell" style={itemStyle}> {item.text} </div>
        <div className="grid-cell text-right">
          <div className="btn-group">
            <button className="btn btn-danger" onClick={onDelete.bind(this, item.id)}>Delete</button>
            <button className={BtnText.style} onClick={onToggle.bind(this, item.id)}>{BtnText.text}</button>
          </div>
        </div>
      </div>
      <div>
        <br/>
      </div>
    </div>
  );
};

module.exports = TodoItem;
