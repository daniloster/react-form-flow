/**
 * Subject similar to rxjs Subject
 */
export default class Subject {
  subscribers = [];

  subscribe(listener) {
    const self = this;
    const subscriber = {
      listener,
    };

    self.subscribers.push(subscriber);

    return {
      unsubscribe: () => {
        self.subscribers = self.subscribers.filter(item => item !== subscriber);
      },
    };
  }

  next(...args) {
    this.subscribers.forEach(({ listener }) => {
      listener.next(...args);
    });
  }
}
