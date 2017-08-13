import RD from './rd.js';

export default RD.registerComponent('rd-table', class extends RD.Component {
  render () {
    const data = Array.isArray(this.attributes.data) ? this.attributes.data : [];
    const trs = data.map(tr => Array.isArray(tr) ? tr : [tr]).map(tr => {
      return ({
        type: 'tr',
        children: tr.map(td => td.name === 'td' ? td : ({
          type: 'td',
          children: td
        }))
      });
    });
    const content = Array.isArray(this.attributes.head) ? [{
      type: 'thead',
      children: {
        type: 'tr',
        children: this.attributes.head.map(th => ({type: 'th', children: th}))
      }
    }, {
      type: 'tbody',
      children: trs
    }] : trs;
    return ({
      type: 'table',
      children: content
    });
  }
});
