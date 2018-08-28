import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

declare let require: any;
declare let window: any;
const Web3 = require('web3');
const TRUFFLE_CONFIG = require('../../../truffle');

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  public useWebSockets = false; // Disabled for improved interoperability with current tools
  public web3: any;
  private networkId: number;

  constructor(private ngZone: NgZone) {
    if (typeof window.web3 === 'undefined') {
      // Listen for provider injection
      window.addEventListener('message', ({ data }) => {
        if (data && data.type && data.type === 'ETHEREUM_PROVIDER_SUCCESS') {
          console.log('Using Web3 provided by the browser as requested');
          this.web3 = new Web3(window.ethereum);
        }
      });
      // Request provider
      window.postMessage({ type: 'ETHEREUM_PROVIDER_REQUEST' }, '*');

      // Default, use local network defined by Truffle config if none provided
      if (this.useWebSockets) {
        const localNode = 'ws://' + TRUFFLE_CONFIG.networks.development.host + ':' +
          TRUFFLE_CONFIG.networks.development.port;
        console.log('Using Web3 for local node: ' + localNode);
        this.web3 = new Web3(new Web3.providers.WebsocketProvider(localNode));
      } else {
        const localNode = 'http://' + TRUFFLE_CONFIG.networks.development.host + ':' +
          TRUFFLE_CONFIG.networks.development.port;
        console.log('Using Web3 for local node: ' + localNode);
        this.web3 = new Web3(new Web3.providers.HttpProvider(localNode));
        // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
        Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      }
    } else {
      console.log('Using Web3 provided by the browser');
      this.web3 = new Web3(window.web3.currentProvider);
    }
    this.web3.eth.net.getId().then(networkId => this.networkId = networkId);
  }

  public getNetworkName() {
    switch (this.networkId) {
      case 1: return 'MainNet';
      case 2: return 'Morden';
      case 3: return 'Ropsten';
      case 4: return 'Rinkeby';
      default: return 'LocalNet';
    }
  }

  public getAccounts(): Observable<string[]> {
    return new Observable((observer) => {
      this.web3.eth.getAccounts()
        .then(accounts => {
          this.ngZone.run(() => {
            if (accounts.length === 0) {
              observer.error('Couldn\'t get any accounts. Make sure you are logged in MetaMask ' +
                'or Web3-enabled browser');
            }
            observer.next(accounts);
            observer.complete();
          });
        })
        .catch(error => {
          console.error(error);
          this.ngZone.run(() => {
            observer.error(new Error('Retrieving accounts<br>' +
              'A Web3-enable browser or supporting the ' +
              '<a target="_blank" href="https://metamask.io">MetaMask</a> extension required'));
          });
        });
      return { unsubscribe() {} };
    });
  }

  public getBlockDate(blockNumber: number): Observable<Date> {
    return new Observable((observer) => {
      this.web3.eth.getBlock(blockNumber)
      .then(block => {
        this.ngZone.run(() => {
          observer.next(new Date(block.timestamp * 1000));
          observer.complete();
        });
      })
      .catch(error => {
        console.error(error);
        this.ngZone.run(() => {
          observer.error('Block date not retrieved, see log for details');
          observer.complete();
        });
      });
      return { unsubscribe() {} };
    });
  }
}
