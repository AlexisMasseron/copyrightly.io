import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { AlertsService } from '../../alerts/alerts.service';
import { Web3Service } from '../../util/web3.service';
import { RegistryContractService } from '../registry-contract.service';
import { Manifestation } from '../manifestation';

@Component({
  selector: 'app-manifest-single',
  templateUrl: './manifest-single.component.html',
  styleUrls: ['./manifest-single.component.css']
})
export class ManifestSingleComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  accounts: string[];
  account: string;
  manifestation = new Manifestation();

  constructor(private web3Service: Web3Service,
              private registryContractService: RegistryContractService,
              private alertsService: AlertsService) {}

  ngOnInit(): void {
    this.getAccounts();
  }

  getAccounts() {
    this.web3Service.getAccounts().pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      (accounts: string[]) => {
        this.accounts = accounts;
        this.account = accounts[0];
        },
      error => this.alertsService.error(error));
  }

  manifest() {
    this.registryContractService.manifest(this.manifestation, this.account)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((receipt) => {
        console.log('Transaction receipt: ' + receipt);
        this.alertsService.info('Registration submitted, waiting for confirmation...<br>' +
          'Receipt: <a href="' + receipt + '">' + receipt + '</a>');
      }, error => {
        this.alertsService.error(error);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
