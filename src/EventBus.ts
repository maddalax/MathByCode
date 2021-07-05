import { guid } from './Util';

export type EventFunc = (payload: any) => void

export class EventBus {

  static indexMap: Record<string, {index: number, event: string}> = {};

  static listeners: Record<string, EventFunc[]> = {}

  static register(event: string, callback : EventFunc) : string {
    if(!this.listeners[event]) {
      this.listeners[event] = [];
    }
    const length = this.listeners[event].push(callback);
    const id = guid();
    this.indexMap[id] = {index: length - 1, event}
    return id;
  }

  static unregister(id: string) {
    const listener = this.indexMap[id];
    if(listener) {
     this.listeners[listener.event].splice(listener.index, 1);
     delete this.indexMap[id];
    }
  }

  static dispatch(event: string, payload: any) {
    const listeners = this.listeners[event];
    if(!listeners) {
      return;
    }
    listeners.forEach(l => l(payload));
  }

}