import { Injectable } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { Observable } from 'rxjs/internal/Observable';
import { Manifestation } from './manifestation';

import * as contract from 'truffle-contract';

declare const require: any;
const artifacts = require('../../assets/Registry.json');

@Injectable({
  providedIn: 'root'
})
export class RegistryContractService {

  private deployedContract: any;

  constructor(private web3Service: Web3Service) {
    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(web3Service.web3.currentProvider);
    contractAbstraction.deployed()
      .then((deployedContract) => this.deployedContract = deployedContract);
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
}
