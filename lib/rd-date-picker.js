RD.registerComponent('rd-date-picker', class extends RD.Component {
  init () {
    const today = new Date();
    this.day = today.getDate();
    this.month = today.getMonth() + 1; // January is 1
    this.year = today.getFullYear();

  }
  render () {

  }
});
