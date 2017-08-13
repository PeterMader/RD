class Greeter extends RD.Component {

  constructor (name) {
    super();
    this.name = name;
  }

  render () {
    return ({
      type: 'span',
      children: ['Hello, ', {
        type: 'span',
        style: { color: 'red' },
        text: this.name
      }, '!']
    });
  }

}
