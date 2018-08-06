import { Injectable, NgZone } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { Observable } from 'rxjs/internal/Observable';
import { Event } from './event';
import { ManifestationEvent } from './manifestation-event';
import { Manifestation } from './manifestation';
import { ReplaySubject } from 'rxjs';

declare const require: any;
const artifacts = require('../../assets/Registry.json');

@Injectable({
  providedIn: 'root'
})
export class RegistryContractService {

  private deployedContract = new ReplaySubject<any>(1);

  constructor(private web3Service: Web3Service,
              private ngZone: NgZone) {
    this.web3Service.web3.eth.net.getId()
    .then(network_id => {
      const deployedAddress = artifacts.networks[network_id].address;
      this.deployedContract.next(
        new this.web3Service.web3.eth.Contract(artifacts.abi, deployedAddress));
    });
  }

  public getManifestation(hash: string): Observable<Manifestation> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.methods.getManifestation(hash).call()
        .then(function (result) {
          observer.next(new Manifestation(
            {hash: hash, title: result[0], authors: result[1]}));
          observer.complete();
        })
        .catch(function (error) {
          console.error(error);
          observer.error(new Error('Error retrieving manifestation, see logs for details'));
        });
      });
      return { unsubscribe() {} };
    });
  }

  public manifest(manifestation: Manifestation, account: string): Observable<any> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.methods.manifestAuthorship(manifestation.hash, manifestation.title)
          .send({from: account, gas: 100000})
        .then(receipt => {
          if (!receipt) {
            observer.error(new Error('Transaction failed!'));
          } else {
            observer.next(receipt);
            observer.complete();
          }
        })
        .catch(error => {
          console.error(error);
          observer.error(new Error('Error registering creation, see log for details'));
        });
      });
      return { unsubscribe() {} };
    });
  }

  public watchManifestEvents(account: string): Observable<Event> {
    return new Observable((observer) => {
      this.ngZone.runOutsideAngular(() => {
        this.deployedContract.subscribe(contract => {
          contract.events.ManifestEvent({ filter: { manifester: account }, fromBlock: 'latest' })
            .on('data', event => {
              const manifestation = new Manifestation({
                hash: event.returnValues.hash,
                title: event.returnValues.title,
                authors: event.returnValues.authors
              });
              const manifestationEvent = new ManifestationEvent({
                type: event.event,
                who: event.returnValues.manifester,
                what: manifestation
              });
              this.web3Service.getBlockDate(event.blockNumber)
              .subscribe(date => {
                manifestationEvent.when = date;
                this.ngZone.run(() => observer.next(manifestationEvent));
              });
            })
            .on('error', error => {
              console.log(error);
              this.ngZone.run(() =>
                observer.error(new Error('Error listening to contract events, see log for details')));
            });
          });
        });
      return { unsubscribe() {} };
    });
  }

  public listManifestEvents(account: string): Observable<ManifestationEvent[]> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.getPastEvents('ManifestEvent',
          { filter: { manifester: account }, fromBlock: 0 })
        .then(events => {
          observer.next(events.map(event => {
            const manifestation = new Manifestation({
              hash: event.returnValues.hash,
              title: event.returnValues.title,
              authors: event.returnValues.authors
            });
            const manifestationEvent = new ManifestationEvent({
              type: event.event,
              who: event.returnValues.manifester,
              what: manifestation
            });
            this.web3Service.getBlockDate(event.blockNumber)
            .subscribe(date => {
              this.ngZone.run(() => manifestationEvent.when = date);
            });
            return manifestationEvent;
          }));
        })
        .catch(error => {
          console.log(error);
          observer.error(new Error('Error listening to contract events, see log for details'));
        });
      });
      return { unsubscribe() {} };
    });
  }
}
