import Firebase from 'firebase';

export default class _Firebase {
  constructor(store, path) {
    this.ref = new Firebase(`https://surgeclub.firebaseio.com`);
    this.path = path;

    return this;

    // this.ref.child(this.path).on('child_added', (snapshot) => {
    //
    // });
    //
    // this.ref.child(this.path).on('child_removed', (snapshot) => {
    //
    // });
  }
}
