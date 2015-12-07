Package.describe({
  name: 'todo-actions',
  version: '0.0.1'
});

Package.onUse(function (api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('zenflux:actions', 'client');


  api.addFiles('todo-actions.js', 'client');
});
