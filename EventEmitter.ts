import { useMemo } from 'react';

export type Handler<T extends unknown[]> = (...args: T) => void;

export class EventEmitter<T extends unknown[]> {
  private handlers: {[key: string]: Array<Handler<T>>}  = {};
  on(event: string, handler: Handler<T>) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }
  off(event: string, handler?: Handler<T>) {
    if (this.handlers[event]) {
      if (handler) {
        this.handlers[event] = this.handlers[event].filter(fn => {
          return handler === fn;
        });
      } else {
        delete this.handlers[event];
      }
    }
  }
  trigger(event: string, ...args: T) {
    if (this.handlers[event]) {
      this.handlers[event].forEach(fn => {
        fn(...args);
      });
    }
  }
};

export const useEventEmitter = () => {
  return useMemo(() => new EventEmitter(), []);
};
