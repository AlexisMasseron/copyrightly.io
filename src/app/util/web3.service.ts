import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import * as contract from 'truffle-contract';

declare let require: any;
declare let window: any;

const Web3 = require('web3');
const TRUFFLE_CONFIG = require('../../../truffle');

@Injectable()
export class Web3Service {
  private web3: any;

  constructor() {
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }

  public bootstrapWeb3() {
    if (typeof window.web3 !== 'undefined') {
      console.log('Using Web3 provided by the browser');
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      const localNode = 'http://' + TRUFFLE_CONFIG.networks.development.host + ':' +
        TRUFFLE_CONFIG.networks.development.port;
      console.log('Using Web3 for local node: ' + localNode);
      this.web3 = new Web3(new Web3.providers.HttpProvider(localNode));

      // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
      Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
    }
  }

  public async artifactsToContract(artifacts) {
    if (!this.web3) this.bootstrapWeb3();
    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;
  }

  public getAccounts(): Observable<string[]> {
    return new Observable((observer) => {
      this.web3.eth.getAccounts()
        .then(function(accounts) {
          observer.next(accounts);
          observer.complete();
        })
        .catch(function(error) {
          console.error(error);
          observer.error(new Error('Error retrieving accounts, see logs for details'));
        });
      return { unsubscribe() {} };
    })
  }
}
