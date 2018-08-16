import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

declare let require: any;
declare let window: any;
const Web3 = require('web3');
const TRUFFLE_CONFIG = require('../../../truffle');

@Injectable()
export class Web3Service {
  public web3: any;

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      console.log('Using Web3 provided by the browser');
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      const localNode = 'ws://' + TRUFFLE_CONFIG.networks.development.host + ':' +
        TRUFFLE_CONFIG.networks.development.port;
      console.log('Using Web3 for local node: ' + localNode);
      this.web3 = new Web3(new Web3.providers.WebsocketProvider(localNode));
    }
  }

  public getAccounts(): Observable<string[]> {
    return new Observable((observer) => {
      this.web3.eth.getAccounts()
        .then(function(accounts) {
          if (accounts.length === 0) {
            observer.error('Couldn\'t get any accounts. Make sure you are logged in MetaMask');
          }
          observer.next(accounts);
          observer.complete();
        })
        .catch(function(error) {
          console.error(error);
          observer.error(new Error('Error retrieving accounts, see logs for details'));
        });
      return { unsubscribe() {} };
    });
  }

  public getBlockDate(blockNumber: number): Observable<Date> {
    return new Observable((observer) => {
      this.web3.eth.getBlock(blockNumber)
      .then(function(block) {
        observer.next(new Date(block.timestamp * 1000));
        observer.complete();
      })
      .catch(function(error) {
        console.error(error);
      });
      return { unsubscribe() {} };
    });
  }
}
