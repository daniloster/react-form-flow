import Subject from './Subject';
import Subscriber from './Subscriber';

class ObservableState<T> {
  private subject: Subject<T>;
  private value: T;
  
  static create = <T>(initialValue: T): ObservableState<T> => new ObservableState<T>(initialValue);
  
  private constructor(initialValue: T) {
    this.value = initialValue;
    this.subject = new Subject();
  }

  get = () => this.value;
  set = (transformer: ((v: T) => T)) => {
    const frozenValue = Object.freeze(this.value);
    const newValue = transformer(frozenValue);
    if (frozenValue !== newValue) {
      this.value = newValue;
      this.subject.next(this.value);
    }
  };
  subscribe = (subscriber: Subscriber<T>) => this.subject.subscribe(subscriber);
};

export default ObservableState;
