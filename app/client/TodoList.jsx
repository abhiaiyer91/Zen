import React from 'react';
import reactMixin from 'react-mixin';
import TodoItem from './TodoItem';
import getVisibleTodos from './helpers/getVisibleTodos';
import toggleTodo from './actionDispatchers/toggleTodo';
import deleteTodo from './actionDispatchers/deleteTodo';


class RewindButton extends React.Component {
  constructor() {
    super();
    this.timeTravel = this.timeTravel.bind(this);
    this.getActions = this.getActions.bind(this);
  }

  timeTravel() {
    const { store } = this.context;
    return store.timeTravelBack();
  }

  getActions() {
    return Session.get('recent.action.type') || [];
  }

  render() {
    var action = this.getActions() && this.getActions().map((action) => {
      var item = JSON.stringify(action);
      return (
        <div>
          <pre>
          {item}
          </pre>
        </div>
      )
    });
    var style = {
      marginBottom: 30
    };
    return (
      <div>
        <button style={style} onClick={this.timeTravel} className="btn btn-warning">Rewind</button>
        {action}
      </div>
    )
  }
}

RewindButton.contextTypes = {
  store: React.PropTypes.object
};

reactMixin(RewindButton.prototype, TrackerReact);

const TodoList = ({
  todos,
  onDeleteClick,
  onToggleClick
  }) => (
  <div>
    {todos.map(todo => <TodoItem key={todo.id} onToggle={onToggleClick} onDelete={onDeleteClick} item={todo}/>)}
  </div>
);

class VisibleTodoList extends React.Component {
  constructor() {
    super();
    this.onToggle = this.onToggle.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  /**
   * Dispatch to the TodoStore a Toggle Action
   * @param id
   */
  onToggle(id) {
    const { store } = this.context;
    store.dispatch(toggleTodo(id));
  }

  /**
   * Dispatch to the TodoStore a Delete Action
   * @param id
   */
  onDelete(id) {
    const { store } = this.context;
    store.dispatch(deleteTodo(id));
  }

  /**
   * Get the current state of the visibility filter
   * @returns {string|*}
   */
  visibilityFilter() {
    const { store } = this.context;
    return store.getState().visibility;
  }

  /**
   * Reactive get on TodoStore state
   * @returns {*|Array}
   */
  getItems() {
    const { store } = this.context;
    return getVisibleTodos(store.getState().todos, this.visibilityFilter());
  }

  render() {
    const props = this.props;
    return (
      <div>
        <TodoList
          todos={this.getItems()}
          onDeleteClick={this.onDelete}
          onToggleClick={this.onToggle}
          />
        <RewindButton/>
      </div>
    );
  }
}

VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
};

reactMixin(VisibleTodoList.prototype, TrackerReact);

module.exports = VisibleTodoList;
