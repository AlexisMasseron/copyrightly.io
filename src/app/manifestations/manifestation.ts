export class Manifestation {
  hash: string;
  title: string;
  authors: string[];
  when: Date;

  constructor(values: Object = {}) {
    if (values.hasOwnProperty('when')) {
      values['when'] = new Date(values['when'] * 1000);
    }
    Object.assign(this, values);
  }
}
