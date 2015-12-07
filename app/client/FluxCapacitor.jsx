import React from 'react';
import reactMixin from 'react-mixin';

const styles = {
  buttonBar: {
    padding: "16px",
    position: "fixed",
    top: 0,
    right: 0
  }
};

class RewindButton extends React.Component {
  constructor() {
    super();
    this.timeTravel = this.timeTravel.bind(this);
    this.getActions = this.getActions.bind(this);
    this.openSidepanel = this.openSidepanel.bind(this);
    this.closeSidepanel = this.closeSidepanel.bind(this);
  }

  timeTravel() {
    const { store } = this.context;
    const actions = Session.get('recent.action.type') || [];
    let actionsReversed = actions && actions.reverse();
    let returnedAction;
    if (actionsReversed.length === 1) {
      returnedAction = [];
    } else {
      returnedAction = actionsReversed.splice(0, 1);
    }
    Session.set('recent.action.type', returnedAction);
    return store.timeTravelBack();
  }

  openSidepanel(event) {
    event.preventDefault();
    $('.cd-panel').addClass('is-visible');
  }

  closeSidepanel(event) {
    if ($(event.target).is('.cd-panel') || $(event.target).is('.ev-close')) {
      $('.cd-panel').removeClass('is-visible');
      event.preventDefault();
    }
  }

  getActions() {
    const actions = Session.get('recent.action.type') || [];
    return actions && actions.reverse();
  }

  render() {
    var action = this.getActions() && this.getActions().map((action) => {
        var item = JSON.stringify(action, null, 2);
        return (
          <div className="action-list-item">
            <div className="action-header">
              <span>{action.type}</span>
            </div>
          <pre>
          {item}
          </pre>
          </div>
        )
      });
    return (
      <div>
        <div style={styles.buttonBar}>
          <button onClick={this.openSidepanel} className="cd-btn btn btn-success">Open Dev Tools</button>
        </div>
        <div className="cd-panel from-right">
          <header className="cd-panel-header">
            <div className="flex-grid">
              <div className="grid-cell">
                <span>ZenFlux Time Travel Debugger</span>
              </div>
              <div className="grid-cell text-right">
                <div className="btn-group">
                  <button onClick={this.timeTravel} className="btn btn-warning">Rewind</button>
                  <button onClick={this.closeSidepanel} className="ev-close btn btn-danger">Close</button>
                </div>
              </div>
            </div>
          </header>

          <div className="cd-panel-container">
            <div className="cd-panel-content">
              <div>
                {action}
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

RewindButton.contextTypes = {
  store: React.PropTypes.object
};

reactMixin(RewindButton.prototype, TrackerReact);

module.exports = RewindButton;
