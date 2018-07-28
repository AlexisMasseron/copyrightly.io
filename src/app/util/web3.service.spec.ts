import {TestBed, inject} from '@angular/core/testing';
import Web3 from 'web3';

import {Web3Service} from './web3.service';

import metacoin_artifacts from '../../../build/contracts/MetaCoin.json';
const TRUFFLE_CONFIG = require('../../../truffle');

declare let window: any;

describe('Web3Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Web3Service]
    });
  });

  it('should be created', inject([Web3Service], (service: Web3Service) => {
    expect(service).toBeTruthy();
  }));

  it('should inject a default local node web3 on a contract',
    inject([Web3Service], (service: Web3Service) => {
      const localNode = 'http://' + TRUFFLE_CONFIG.networks.development.host + ':' +
        TRUFFLE_CONFIG.networks.development.port;

      service.bootstrapWeb3();

      return service.artifactsToContract(metacoin_artifacts).then((abstraction) => {
        expect(abstraction.currentProvider.host).toBe(localNode);
      });
    })
  );

  it('should inject the browser web3 on a contract if available',
    inject([Web3Service], (service: Web3Service) => {
      window.web3 = {
        currentProvider: new Web3.providers.HttpProvider('http://localhost:1337')
      };

      service.bootstrapWeb3();

      return service.artifactsToContract(metacoin_artifacts).then((abstraction) => {
        expect(abstraction.currentProvider.host).toBe('http://localhost:1337');
      });
    })
  );
});
