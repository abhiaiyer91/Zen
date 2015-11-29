import ZenStore from '../../../modules/ZenStore/store';
import combineProcesses from '../../../modules/ZenStore/combineProcesses';
import todos from '../processes/todosProcess';
import visibilityFilter from '../processes/visibilityProcess';

/**
 * Fixture data
 * @type {{id: number, text: string, completed: boolean}}
 */
const helloThere = {
  id: 0,
  text: 'Hello World',
  completed: false
};

/**
 * Combine processes for different parts of the store
 */
const processes = combineProcesses({
  todos,
  visibilityFilter
});

/**
 * Create a new Zen Store
 * @type {ZenStore|*}
 */

const TodoStore = new ZenStore(processes, {
  todos: [helloThere],
  visibility: 'SHOW_ALL'
});

module.exports = TodoStore;
