import { Injectable } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { Observable } from 'rxjs/internal/Observable';
import { Event } from './event';
import { ManifestationEvent } from './manifestation-event';
import { Manifestation } from './manifestation';

import * as contract from 'truffle-contract';

declare const require: any;
const artifacts = require('../../assets/Registry.json');

@Injectable({
  providedIn: 'root'
})
export class RegistryContractService {

  private contractAbstraction: any;
  private deployedContract: any;

  constructor(private web3Service: Web3Service) {
    this.contractAbstraction = contract(artifacts);
    this.contractAbstraction.setProvider(web3Service.web3.currentProvider);
    this.contractAbstraction.deployed()
      .then((deployedContract) => {
        this.deployedContract = deployedContract;
      });
  }

  public getManifestation(hash: string): Observable<Manifestation> {
    return new Observable((observer) => {
      this.deployedContract.getManifestation(hash)
        .then(function(result) {
          observer.next(new Manifestation(
            { hash: hash, title: result[0], authors: result[1]}));
          observer.complete();
        })
        .catch(function(error) {
          console.error(error);
          observer.error(new Error('Error retrieving manifestation, see logs for details'));
        });
      return { unsubscribe() {} };
    });
  }

  public manifest(manifestation: Manifestation, account: string): Observable<any> {
    return new Observable((observer) => {
      this.deployedContract.manifestAuthorship.sendTransaction(
        manifestation.hash, manifestation.title, {from: account})
        .then(function(receipt) {
          if (!receipt) {
            observer.error(new Error('Transaction failed!'));
          } else {
            observer.next(receipt);
            observer.complete();
          }
        })
        .catch(function(error) {
          console.error(error);
          observer.error(new Error('Error registering creation, see log for details'));
        });
      return { unsubscribe() {} };
    });
  }

  public watchEvents(filters: any): Observable<Event> {
    return new Observable((observer) => {
      this.contractAbstraction.deployed()
        .then((deployedContract) => {
          deployedContract.allEvents({ filter: filters, fromBlock: 'latest' }, (error, event) => {
            if (!error) {
              const manifestation = new Manifestation({
                hash: event.args.hash,
                title: event.args.title,
                authors: event.args.authors });
              const manifestationEvent = new ManifestationEvent( {
                type: event.event,
                who: event.args.manifester,
                what: manifestation
              });
              this.web3Service.getBlockDate(event.blockNumber)
                .subscribe(date => {
                  manifestationEvent.when = date;
                  observer.next(manifestationEvent);
                });
            } else {
              console.log(error);
              observer.error(new Error('Error listening to contract events, see log for details'));
            }
          })
        });
      return { unsubscribe() {} };
    });
  }
}
