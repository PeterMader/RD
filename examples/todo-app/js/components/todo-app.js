class TodoApp extends RD.Component {
  constructor () {
    super();
    this.todoList = new TodoList();
    this.todoList.on('update-app', this.update.bind(this));
    this.header = this.createHeader();
    this.main = this.createMain();
    this.footer = this.createFooter();
  }
  render () {
    const children = [this.header];
    if (this.todoList.todos.length > 0) {
      children.push(this.main);
      children.push(this.createFooter());
    }
    return ({
      type: 'div',
      children
    });
  }
  createHeader () {
    const {todoList} = this;
    return ({
      type: 'header',
      children: [{
        type: 'h1',
        text: 'todos'
      }, {
        type: 'input',
        attributes: {
          'class': 'new-todo',
          placeholder: 'What needs to be done?',
          value: ''
        },
        events: {
          keyup (e)  {
            if (e.key === 'Enter') {
              todoList.addTodo(this.value);
              this.value = '';
            }
          }
        }
      }]
    });
  }
  createMain () {
    const {todoList} = this;
    return ({
      type: 'section',
      attributes: {
        'class': 'main'
      },
      children: [{
        type: 'input',
        attributes: {
          type: 'checkbox',
          'class': 'toggle-all'
        },
        events: {
          click () {
            todoList.setAll(this.checked);
          }
        }
      }, todoList]
    });
  }
  createFooter () {
    const {todoList} = this;
    const buttons = this.buttons || this.createButtons();
    if (!this.buttons) {
      this.buttons = buttons;
    }
    const clearCompleted = todoList.getCompletedTodos().length > 0 ? [{
      type: 'button',
      attributes: {
        'class': 'clear-completed'
      },
      events: {
        click () {
          todoList.clearCompleted();
        }
      },
      text: 'Clear completed'
    }] : [];
    return ({
      type: 'footer',
      attributes: {
        'class': 'footer'
      },
      children: [todoList.todoCount, {
        type: 'ul',
        attributes: {
          'class': 'filters'
        },
        children: [buttons[0], ' ', buttons[1], ' ', buttons[2]]
      }].concat(clearCompleted)
    });
  }
  createButtons () {
    const filters = [TodoList.filterAll, TodoList.filterActive, TodoList.filterCompleted];
    const names = ['all', 'active', 'completed'];
    const buttons = filters.map((_, i) => RD.h({
      type: 'a',
      attributes: {
        'href': '#'
      },
      text: names[i]
    }));
    buttons.forEach((button, index) => {
      const filter = filters[index];
      const other = buttons.filter((_, i) => i !== index);
      RD.merge(button, {
        events: {
          click: () => {
            other.forEach(button => button.classList.remove('selected'));
            button.classList.add('selected');
            this.todoList.filter = filter;
            this.todoList.update();
          }
        }
      });
    });
    buttons[0].classList.add('selected');
    return buttons.map(button => RD.h({
      type: 'li',
      children: [button]
    }));
  }
}
