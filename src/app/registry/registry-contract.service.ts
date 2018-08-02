import { Injectable } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { Observable } from 'rxjs/internal/Observable';
import { Manifestation } from './manifestation';

import * as contract from 'truffle-contract';
import { Subject } from 'rxjs/internal/Subject';

declare const require: any;
const artifacts = require('../../assets/Registry.json');

@Injectable({
  providedIn: 'root'
})
export class RegistryContractService {

  private deployedContract: any;
  private manifestEventSource = new Subject<Manifestation>();
  private firstEvent = false;

  constructor(private web3Service: Web3Service) {
    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(web3Service.web3.currentProvider);
    contractAbstraction.deployed()
      .then((deployedContract) => {
        this.deployedContract = deployedContract;
        this.firstEvent = true;
        this.watchContractEvents();
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

  public events(): Observable<Manifestation> {
    return this.manifestEventSource.asObservable();
  }

  private watchContractEvents() {
    this.deployedContract.allEvents({ fromBlock: 'latest' }, (error, event) => {
      if (!error) {
        if (this.firstEvent) { // Ignore first as it is the last one
          this.firstEvent = false;
          return
        }
        this.manifestEventSource.next(new Manifestation({
          hash: event.args.hash, title: event.args.title, authors: event.args.authors
        }));
      } else {
        console.error(error);
      }
    });
  }
}
