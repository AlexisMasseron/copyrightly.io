export class Event {
  type: string;
  who: string;
  what: any;
  when: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
