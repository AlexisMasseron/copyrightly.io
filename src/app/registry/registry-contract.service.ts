import { Injectable } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { Observable } from 'rxjs/internal/Observable';
import { Manifestation } from './manifestation';

declare const require: any;
const registry_artifacts = require('../../assets/Registry.json');

@Injectable({
  providedIn: 'root'
})
export class RegistryContractService {

  private registryContract: any;

  constructor(private web3Service: Web3Service) {
    const contract = this.web3Service.artifactsToContract(registry_artifacts);
    contract.deployed().then((deployedContract) => this.registryContract = deployedContract);
  }

  public getManifestation(hash: string): Observable<Manifestation> {
    return new Observable((observer) => {
      this.registryContract.getManifestation(hash)
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
      this.registryContract.manifestAuthorship.sendTransaction(
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
