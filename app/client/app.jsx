import React from 'react';
import ReactDOM from 'react-dom';
import TodoStore from './store/TodoStore';
import VisibleTodoList from './TodoList';
import AddTodoComponent from './AddTodo';
import RewindButton from './FluxCapacitor';
import FilterBarComponent from './FilterBar';
import Provider from '../../modules/ZenStore/ZenProvider';

const TodoComponent = class TodoComponent extends React.Component {
  render() {
    const listStyle = {
      maxWidth: "480px",
      margin: "0 auto",
      border: "1px solid #CCC",
      padding: "16px",
      borderRadius: "4px",
      marginTop: "24px"
    };
    const { store }  = this.props;
    return (
      <div>
        <div className="container">
          <div style={listStyle}>
            <AddTodoComponent store={store}/>

            <h1>Todos List</h1>
            <FilterBarComponent store={store}/>
            <VisibleTodoList store={store}/>
          </div>
        </div>
        <RewindButton/>
      </div>
    )
  }
};

Meteor.startup(() => {
  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);
  ReactDOM.render(<Provider store={TodoStore}><TodoComponent /></Provider>, document.getElementById('root'));
});

