import React from 'react';

const AddTodoComponent = (props, {store}) => {
  let input;
  return (
    <div className="media">
      <div className="media-body">
        <input ref={node=> {
        input =node;
        }} className="form-control" type="text"/>
      </div>
      <div className="media-right">
        <button className="btn btn-primary" onClick={() => {
            store.dispatch({
              id: 1,
              type: 'ADD_TODO',
              data: {
                id: Random.id(),
                text: input.value,
                completed: false
              }
            });
            input.value = '';
        }}>Add Item
        </button>
      </div>
    </div>
  );
};

AddTodoComponent.contextTypes = {
  store: React.PropTypes.object
};

module.exports = AddTodoComponent;
