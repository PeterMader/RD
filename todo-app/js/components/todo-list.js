class TodoList extends RD.Component {
  constructor () {
    super();
    this.todos = [];
    this.filter = TodoList.filterAll;
    this.todoCount = new TodoCount();
  }
  render () {
    const todos = this.todos.filter(this.filter);
    this.todoCount.emit('update', this.getActiveTodos().length);
    return ({
      type: 'ul',
      attributes: {
        'class': 'todo-list'
      },
      children: todos
    });
  }
  addTodo (text) {
    const todo = new Todo(text);
    todo.on('remove', this.removeTodo.bind(this));
    todo.on('toggle', this.emit.bind(this, 'update-app'));
    this.todos.push(todo);
    this.emit('update-app');
  }
  removeTodo (todo) {
    this.todos = this.todos.filter(t => t !== todo);
    this.emit('update-app');
  }
  setAll (state) {
    this.todos.forEach(todo => todo.completed = state);
    this.update();
  }
  getActiveTodos () {
    return this.todos.filter(TodoList.filterActive);
  }
  getCompletedTodos () {
    return this.todos.filter(TodoList.filterCompleted);
  }
  clearCompleted () {
    this.todos = this.getActiveTodos();
    this.emit('update-app');
  }
  static filterAll () {
    return true;
  }
  static filterActive (todo) {
    return !todo.completed;
  }
  static filterCompleted (todo) {
    return todo.completed;
  }
}
