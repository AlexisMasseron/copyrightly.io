import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { AlertsService } from '../../alerts/alerts.service';
import { AuthenticationService } from '../../navbar/authentication.service';
import { Web3Service } from '../../util/web3.service';
import { IpfsService } from '../../util/ipfs.service';
import { RegistryContractService } from '../registry-contract.service';
import { Manifestation } from '../manifestation';
import { NgForm } from '@angular/forms';
import { ManifestEventComponent } from '../manifest-event.component';

@Component({
  selector: 'app-manifest-single',
  templateUrl: './manifest-single.component.html',
  styleUrls: ['./manifest-single.component.css']
})
export class ManifestSingleComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  account: string;
  manifestation = new Manifestation();
  status = 'Register';
  uploadToIpfs = true;

  constructor(private web3Service: Web3Service,
              private ipfsService: IpfsService,
              private registryContractService: RegistryContractService,
              private alertsService: AlertsService,
              private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.authenticationService.getSelectedAccount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(account => this.account = account );
  }

  loadFile(event) {
    if (event.files.length > 0) {
      this.status = 'Uploading...';
      this.ipfsService.uploadFile(event.files[0], this.uploadToIpfs)
      .subscribe((hash: string) => {
        this.status = 'Register';
        this.manifestation.hash = hash;
      }, error => {
        this.status = 'Register';
        this.alertsService.error(error);
      });
    } else {
      this.manifestation.hash = '';
    }
  }

  manifest(form: NgForm) {
    this.registryContractService.manifest(this.manifestation, this.account)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (typeof result === 'string') {
          console.log('Transaction hash: ' + result);
          this.alertsService.info('Registration submitted, you will be alerted when confirmed.<br>' +
            'Receipt: <a target="_blank" href="https://ropsten.etherscan.io/tx/' + result + '">' + result + '</a>');
          form.reset();
        } else {
          console.log(result);
          this.alertsService.modal(ManifestEventComponent, result);
        }
      }, error => {
        this.alertsService.error(error);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
