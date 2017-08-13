class TodoCount extends RD.Component {
  constructor () {
    super();
    this.on('update', count => {
      this.count = count;
      this.update();
    });
    this.count = 0;
  }
  render () {
    const text = this.count === 1 ? '1 item left' : `${this.count} items left`;
    return ({
      type: 'span',
      attributes: {
        'class': 'todo-count'
      },
      text
    });
  }
}
