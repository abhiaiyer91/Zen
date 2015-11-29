import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers } from 'redux';
import reactMixin from 'react-mixin';
import ZenStore from '../../modules/ZenStore/store';
import combineProcesses from '../../modules/ZenStore/combineProcesses';
const helloThere = {
  id: 0,
  text: 'Hello World',
  completed: false
};

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

/**
 * This is our action processor. It takes the current state and process actions on the state
 * @param state
 * @param action
 * @returns {*}
 */
const todos = (state = {}, action = {}) => {
  switch (action.type) {
    case 'ADD_TODO':
      return state.update({}, {$push: {todos: action.data}});
    case 'TOGGLE_TODO':
      let currentTodos = state.findOne().todos;
      return currentTodos.map(t => todo(t, action, state));
    case 'DELETE_TODO':
      return state.update({}, {$pull: {'todos': {id: action.data.id}}});
    default:
      return state;
  }
};

/**
 * This action processor sets the visibility on todo items
 * @param state
 * @param action
 * @returns {*}
 */
const visibilityFilter = (state = {}, action = {}) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      state.update({}, {$set: {visibility: action.filter}});
      return state.findOne().visibility;
    default:
      return state;
  }
};

const processes = combineProcesses({
  todos,
  visibilityFilter
});

const TodoStore = new ZenStore(processes, {
  todos: [helloThere],
  visibility: 'SHOW_ALL'
});


/**
 * Create a new Zen Store
 * @type {ZenStore|*}
 */


const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
          t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
          t => !t.completed
      );
    default:
      return todos;
  }
};


/**
 * Stateless Component Function for Todo Item
 * @param item
 * @param onToggle
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

const FilterLink = ({
  filter,
  currentFilter,
  children
  }) => {
  if (filter === currentFilter) {
    return <span>{children}</span>;
  }
  return (
    <a href="#" onClick={e => {
    e.preventDefault();
    TodoStore.dispatch({type: 'SET_VISIBILITY_FILTER', filter});
    }}>
      {
        children
      }
    </a>
  );
};

const FilterBarComponent = ({visibilityFilter}) => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
      currentFilter={visibilityFilter()}
      >
      All
    </FilterLink>
    {' - '}
    <FilterLink
      filter='SHOW_ACTIVE'
      currentFilter={visibilityFilter()}
      >
      Active
    </FilterLink>
    {' - '}
    <FilterLink
      filter='SHOW_COMPLETED'
      currentFilter={visibilityFilter()}
      >
      Completed
    </FilterLink>
  </p>
);

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
    let items = this.getItems().map((item) => {
      return <TodoItem onDelete={this.onDelete} onToggle={this.onToggle} key={item.id} item={item}/>
    });
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
          <div className="media">
            <div className="media-body">
              <input className="form-control" type="text" value={this.state.inputVal}
                     onChange={this.handleInputChange}/>
            </div>
            <div className="media-right">
              <button className="btn btn-primary" onClick={this.triggerAdd}>Add Item</button>
            </div>
          </div>


          <h1>Todos List</h1>

          <FilterBarComponent visibilityFilter={this.visibilityFilter}/>
          {items}
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

