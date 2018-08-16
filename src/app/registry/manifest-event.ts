import { Event } from './event';
import { Manifestation } from './manifestation';

export class ManifestEvent extends Event {
  what: Manifestation;

  constructor(event: any) {
    super({ type: event.event, who: event.returnValues.manifester });
    this.what = new Manifestation({
      hash: event.returnValues.hash,
      title: event.returnValues.title,
      authors: event.returnValues.authors
    });
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
