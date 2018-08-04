import { Event } from './event';
import { Manifestation } from './manifestation';

export class ManifestationEvent extends Event {
  what: Manifestation;

  constructor(values: Object = {}) {
    super(values);
    this.what = values['what'];
  }

  toHTML(): string {
    return '<h5>' + this.type.substring(0, this.type.indexOf('Event')) + '</h5>' +
           '<p> Who: ' + this.who + '</p>' +
           '<p> When: ' + this.when + '</p>' +
           '<h6> What: </h6>' +
           '<p>Title: ' + this.what.title + '</p>' +
           '<p>Authors: ' + this.what.authors + '</p>' +
           '<p>Hash: ' + this.what.hash + '</p>';
  }
}
