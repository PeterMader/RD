# RD
A small UI library.

```JavaScript
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

RD.render(document.body, new Greeter('Becci'));
```

This will result in the following DOM structure:

```HTML
<body>
  <span>
    Hello,
    <span style="color: red;">Becci</span>
    !
  </span>
</body>
```

<span>
  Hello, <span style="color: red;">Becci</span>!
</span>
