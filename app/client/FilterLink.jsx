import React from 'react';
import reactMixin from 'react-mixin';
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
  currentState() {
    const { store } = this.context;
    const currentState = store.getState();
    return currentState;
  }
  render() {
    const props = this.props;
    const { store } = this.context;
    let visibility = this.currentState().visibility;
    return (
      <Link active={props.filter === visibility} onClick={() =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }>
        {props.children}
      </Link>
    );
  }
}

FilterLink.contextTypes = {
  store: React.PropTypes.object
};

reactMixin(FilterLink.prototype, TrackerReact);

module.exports = FilterLink;
