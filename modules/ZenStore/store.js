export default class ZenStore {
  constructor(reducer, initialState) {
    if (!_.isFunction(reducer)) {
      throw new Error('Stores must be constructed with reducer functions');
    }
    check(initialState, Object);
    this.currentReducer = reducer;

    // a null mongo collection to hold the single document
    this._collection = new Mongo.Collection(null);
    this._collection.remove({});
    this._collection.insert(initialState);
    this.isDispatching = false;
  }

  /**
   * Get the current value of the store
   * @param options
   */
  getState(options) {
    return this._collection.findOne({}, options);
  }

  /**
   * Remove all contents of the store
   * @returns {*}
   */
  clearStore() {
    return this._collection.remove({});
  }

  /**
   * Return the mini mongo collection instance for mutation
   * @returns {Mongo.Collection|*}
   */
  getCollection() {
    return this._collection;
  }

  /**
   * Hydrate the store with data, remove previous document
   * @param data
   */
  hydrate(data) {
    this._collection.remove({});
    this._collection.insert(data);
  }

  /**
   * Time travel the stores state back to a previous state
   * @param logId
   */
  timeTravelBack(logId) {
    var currentState = this.getState();
    var log = currentState && currentState.log;
    if (_.isUndefined(log)) {
      return;
    }
    var previousLogData;
    if (logId) {
      previousLogData = log[logId - 1];
    } else {
      var lastLog = _.last(log);
      var lastLogId = lastLog && lastLog.id || 1;
      var lastLogIndex = lastLogId - 1 < 0 ? 0 : lastLogId - 1;
      previousLogData = log[lastLogIndex];
    }
    _.extend(previousLogData, {
      log: log
    });
    this.hydrate(previousLogData.data);
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change will be broadcasted
   * by Tracker
   *
   * @param {Object} action A plain object representing “what changed”.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   */
  dispatch(action) {
    if (!_.isObject(action)) {
      throw new Error(
        'Actions must be plain objects. ' +
        'Use custom middleware for async actions.'
      )
    }

    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      )
    }

    if (this.isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      this.isDispatching = true;
      var actionType = Session.get('recent.action.type') || [];
      Session.set('recent.action.type', [...actionType, action]);
      // grab the current state of the object
      var currentState = this.getState();
      var currentLogId = currentState && _.size(currentState.log) + 1;
      this.getCollection().update({}, {
        $push: {
          'log': {
            id: currentLogId,
            data: currentState
          }
        }
      });
      this.currentReducer(this.getCollection(), action)
    } finally {
      this.isDispatching = false
    }
    return action
  }
}


