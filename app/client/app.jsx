import React from 'react';
import ReactDOM from 'react-dom';
import reactMixin from 'react-mixin';
import ZenStore from '../../modules/ZenStore/store';

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
    default:
      return state;
  }
};

/**
 * Create a new Zen Store
 * @type {ZenStore|*}
 */
const TodoStore = new ZenStore(todos, {todos: [helloThere]});

const TodoComponent = class TodoComponent extends React.Component {
  constructor() {
    super();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.triggerAdd = this.triggerAdd.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.state = {
      inputVal: ''
    }
  }

  /**
   * Reactive get on TodoStore state
   * @returns {*|Array}
   */
  getItems() {
    return TodoStore.getState().todos;
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
    })
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
      return <TodoItem onToggle={this.onToggle} key={item.id} item={item}/>
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
          {items}
        </div>

      </div>
    )
  }
};

// Reactivity True
reactMixin(TodoComponent.prototype, TrackerReact);

/**
 * Stateless Component Function for Todo Item
 * @param item
 * @param onToggle
 * @returns {XML}
 * @constructor
 */
const TodoItem = ({item, onToggle}) => {
  const completed = item.completed ? 'line-through' : 'none';
  const BtnText = {
    text: item.completed ? 'Redo' : 'Done',
    style: item.completed ? 'btn btn-danger' : 'btn btn-success'
  };
  const itemStyle = {
    textDecoration: completed
  };
  return (
    <div className="media">
      <div className="media-body media-middle" style={itemStyle}> {item.text} </div>
      <div className="media-right">
        <button className={BtnText.style} onClick={onToggle.bind(this, item.id)}>{BtnText.text}</button>
      </div>
    </div>
  );
};

Meteor.startup(() => {
  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);
  ReactDOM.render(<TodoComponent/>, document.getElementById('root'));
});

