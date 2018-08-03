export class Manifestation {
  hash: string;
  title: string;
  authors: string[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
