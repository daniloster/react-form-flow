import Subject from './Subject';

export default {
  create: initialValue => {
    let value = initialValue;
    const subject = new Subject();

    return {
      get: () => value,
      set: transformer => {
        const frozenValue = Object.freeze(value);
        const newValue = transformer(frozenValue);
        if (frozenValue !== newValue) {
          value = newValue;
          subject.next(value);
        }
      },
      subscribe: subscriber => subject.subscribe(subscriber),
    };
  },
};
