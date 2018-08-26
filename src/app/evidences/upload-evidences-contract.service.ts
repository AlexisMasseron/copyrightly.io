import { Injectable, NgZone } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { Observable } from 'rxjs/internal/Observable';
import { ReplaySubject } from 'rxjs';
import { UploadEvidence } from './uploadEvidence';
import { UploadEvidenceEvent } from './upload-evidence-event';
import { Manifestation } from '../manifestations/manifestation';

declare const require: any;
const evidences = require('../../assets/contracts/UploadEvidences.json');
const proxy = require('../../assets/contracts/AdminUpgradeabilityProxy.json');

const web3 = require('web3');

@Injectable({
  providedIn: 'root'
})
export class UploadEvidencesContractService {

  private deployedContract = new ReplaySubject<any>(1);
  private manifestationsAddress: string;

  constructor(private web3Service: Web3Service,
              private ngZone: NgZone) {
    this.web3Service.web3.eth.net.getId()
    .then(network_id => {
      if (evidences.networks[network_id]) {
        const deployedAddress = evidences.networks[network_id].address;
        this.manifestationsAddress = proxy.networks[network_id].address;
        this.deployedContract.next(
          new this.web3Service.web3.eth.Contract(evidences.abi, deployedAddress));
      } else {
        this.deployedContract.error(new Error('UploadEvidences contract ' +
          'not found in current network with id ' + network_id));
      }
    });
  }

  public getEvidenceExistence(hash: string): Observable<boolean> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.methods.getEvidenceExistence(hash).call()
        .then(result => {
          this.ngZone.run(() => {
            observer.next(result);
            observer.complete();
          });
        })
        .catch(error => {
          console.error(error);
          this.ngZone.run(() => {
            observer.error(new Error('Error retrieving manifestation, see logs for details'));
            observer.complete();
          });
        });
      }, error => this.ngZone.run(() => { observer.error(error); observer.complete(); }));
      return { unsubscribe() {} };
    });
  }

  public addEvidence(evidence: UploadEvidence, account: string): Observable<string | UploadEvidenceEvent> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.methods.addEvidence(this.manifestationsAddress, evidence.evidencedHash, evidence.evidenceHash)
        .send({from: account, gas: 150000})
        .on('transactionHash', hash =>
          this.ngZone.run(() => observer.next(hash)))
        .on('receipt', receipt => {
          receipt.events.UploadEvidenceEvent.returnValues.evidencedHash = evidence.evidencedHash;
          const evidenceEvent = new UploadEvidenceEvent(receipt.events.UploadEvidenceEvent);
          this.web3Service.getBlockDate(receipt.events.UploadEvidenceEvent.blockNumber)
          .subscribe(date => {
            this.ngZone.run(() => {
              evidenceEvent.when = date;
              observer.next(evidenceEvent);
              observer.complete();
            });
          });
        })
        .on('error', error => {
          console.error(error);
          this.ngZone.run(() => {
            observer.error(new Error('Error registering evidence, see log for details'));
            observer.complete();
          });
        });
      }, error => this.ngZone.run(() => { observer.error(error); observer.complete(); }));
      return { unsubscribe() {} };
    });
  }

  public listManifestationEvidences(manifestationHash: string): Observable<UploadEvidenceEvent[]> {
    return new Observable((observer) => {
      this.deployedContract.subscribe(contract => {
        contract.getPastEvents('UploadEvidenceEvent',
          {filter: {evidencedIdHash: web3.utils.soliditySha3(manifestationHash)}, fromBlock: 0})
        .then(events => {
          observer.next(events.map(event => {
            event.returnValues.evidencedHash = manifestationHash;
            const evidenceEvent = new UploadEvidenceEvent(event);
            this.web3Service.getBlockDate(event.blockNumber)
            .subscribe(date =>
              this.ngZone.run(() => evidenceEvent.when = date)
            );
            return evidenceEvent;
          }));
          observer.complete();
        })
        .catch(error => {
          console.log(error);
          this.ngZone.run(() => {
            observer.error(new Error('Error listening manifestation evidences, see log for details'));
            observer.complete()});
        });
      }, error => this.ngZone.run(() => { observer.error(error); observer.complete(); }));
      return { unsubscribe() {} };
    });
  }
}
