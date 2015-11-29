import React from 'react';
import ReactDOM from 'react-dom';
import reactMixin from 'react-mixin';
import TodoStore from './store/TodoStore';

import TodoItem from './TodoItem';
import TodoList from './TodoList';
import AddTodoComponent from './AddTodo';
import FilterBarComponent from './FilterBar';
import getVisibleTodos from './helpers/getVisibleTodos';


const TodoComponent = class TodoComponent extends React.Component {
  constructor() {
    super();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.triggerAdd = this.triggerAdd.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.state = {
      inputVal: ''
    }
  }

  /**
   * Get the current state of the visibility filter
   * @returns {string|*}
   */
  visibilityFilter() {
    return TodoStore.getState().visibility;
  }

  /**
   * Reactive get on TodoStore state
   * @returns {*|Array}
   */
  getItems() {
    return getVisibleTodos(TodoStore.getState().todos, this.visibilityFilter());
  }

  /**
   * Handle change on our text input
   * @param e
   */
  handleInputChange(e) {
    this.setState({inputVal: e.target.value});
  }

  /**
   * Dispatch to the TodoStore a Toggle Action
   * @param id
   */
  onToggle(id) {
    TodoStore.dispatch({
      type: 'TOGGLE_TODO',
      data: {
        id: id
      }
    });
  }

  /**
   * Dispatch to the TodoStore a Delete Action
   * @param id
   */
  onDelete(id) {
    TodoStore.dispatch({
      type: 'DELETE_TODO',
      data: {
        id: id
      }
    });
  }

  /**
   * Dispatch to the TodoStore an Add Action
   */
  triggerAdd() {
    let inputVal = this.state.inputVal;
    TodoStore.dispatch({
      id: 1,
      type: 'ADD_TODO',
      data: {
        id: Random.id(),
        text: inputVal,
        completed: false
      }
    });
    this.setState({inputVal: ''});
  }

  render() {
    const listStyle = {
      maxWidth: "480px",
      margin: "0 auto",
      border: "1px solid #CCC",
      padding: "16px",
      borderRadius: "4px",
      marginTop: "24px"
    };
    return (
      <div className="container">
        <div style={listStyle}>
          <AddTodoComponent inputVal={this.state.inputVal} onInputChange={this.handleInputChange} onClickAdd={this.triggerAdd}/>
          <h1>Todos List</h1>
          <FilterBarComponent visibilityFilter={this.visibilityFilter}/>
          <TodoList todos={this.getItems()} onToggleClick={this.onToggle} onDeleteClick={this.onDelete}/>
        </div>
      </div>
    )
  }
};

// Reactivity, Props to James for this.
reactMixin(TodoComponent.prototype, TrackerReact);

Meteor.startup(() => {
  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);
  ReactDOM.render(<TodoComponent/>, document.getElementById('root'));
});

