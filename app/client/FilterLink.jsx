import React from 'react';
import TodoStore from './store/TodoStore';

const Link = ({
  active,
  children,
  onClick
  }) => {
  if (active) {
    return <span> {children}</span>
  }
  return (
    <a href="#" onClick={e => {
    e.preventDefault();
    onClick();
    }}>
      {children}
    </a>
  );
};

class FilterLink extends React.Component {
  render() {
    const props = this.props;
    const currentState = TodoStore.getState();

    return (
      <Link active={props.filter === currentState.visibility} onClick={() =>
          TodoStore.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }>
        {props.children}
      </Link>
    );
  }
}

module.exports = FilterLink;
