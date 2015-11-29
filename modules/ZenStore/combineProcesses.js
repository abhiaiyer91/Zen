function combineProcesses(reducers) {
  var reducersObj = reducers;
  return function combination (state, action) {
    _.each(_.keys(reducers), function (key) {
      return reducersObj[key](state, action);
    });
  };
}

module.exports = combineProcesses;
