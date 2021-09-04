import Subscriber from './Subscriber';

/**
 * Subject similar to rxjs Subject
 */
export default class Subject<T> {
  subscribers: { listener: Subscriber<T> }[] = [];

  subscribe(listener: Subscriber<T>) {
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

  next(value: T) {
    this.subscribers.forEach(({ listener }) => {
      listener.next(value);
    });
  }
}
