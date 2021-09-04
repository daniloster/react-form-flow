interface Subscriber<T> {
  next(value: T): void;
}

export default Subscriber;
