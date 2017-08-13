class Todo extends RD.Component {
  constructor (text) {
    super();
    this.text = text;
    this.completed = false;
    this.editing = false;
    this.input = document.createElement('input');
  }
  getEditView () {
    const updateText = text => {
      this.text = text;
      this.editing = false;
      this.update();
    }
    RD.merge(this.input, {
      type: 'input',
      attributes: {
        'class': 'edit',
        value: this.text
      },
      events: {
        focusout () {
          updateText(this.value);
        },
        keyup (e) {
          if (e.key === 'Enter') {
            updateText(this.value);
          }
        }
      }
    });
    return this.input;
  }
  getNormalView () {
    return ({
      type: 'div',
      attributes: {
        'class': 'view'
      },
      children: [{
        type: 'input',
        attributes: {
          type: 'checkbox',
          'class': 'toggle'
        },
        events: {
          click: () => {
            this.toggleCompleted();
          }
        }
      }, {
        type: 'label',
        text: this.text,
        events: {
          dblclick: () => {
            this.editing = true;
            this.input.focus();
            this.update();
          }
        }
      }, {
        type: 'button',
        attributes: {
          'class': 'destroy'
        },
        events: {
          click: () => {
            this.emit('remove', this);
          }
        }
      }]
    });
  }
  render () {
    const completed = this.completed ? 'completed' : '';
    const editing = this.editing ? 'editing' : '';
    const attributes = { 'class': `${completed} ${editing}`};
    return ({
      type: 'li',
      attributes,
      children: [this.getNormalView(), this.getEditView()]
    });
  }
  toggleCompleted () {
    this.completed = !this.completed;
    this.emit('toggle');
  }
}
