import React from 'react';

const AddTodoComponent = ({
  inputVal,
  onInputChange,
  onClickAdd
}) => (
  <div className="media">
    <div className="media-body">
      <input className="form-control" type="text" value={inputVal}
             onChange={onInputChange}/>
    </div>
    <div className="media-right">
      <button className="btn btn-primary" onClick={onClickAdd}>Add Item</button>
    </div>
  </div>
);

module.exports = AddTodoComponent;
