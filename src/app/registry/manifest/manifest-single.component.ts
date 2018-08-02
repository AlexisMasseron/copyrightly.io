import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
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
  private subscription: Subscription;

  accounts: string[];
  account: string;
  manifestation = new Manifestation();

  constructor(private web3Service: Web3Service,
              private registryContractService: RegistryContractService,
              private alertsService: AlertsService) {}

  ngOnInit(): void {
    this.getAccounts();
    this.watchManifestEvents();
  }

  ngOnDestroy() {
    this.unwatchManifestEvents();
  }

  getAccounts() {
    this.web3Service.getAccounts().subscribe(
      (accounts: string[]) => {
        this.accounts = accounts;
        this.account = accounts[0];
        },
      error => this.alertsService.error(error));
  }

  manifest() {
    this.registryContractService.manifest(this.manifestation, this.account)
      .subscribe((receipt) => {
        console.log('Transaction receipt: ' + receipt);
        this.alertsService.info('Registration submitted!');
      }, error => {
        this.alertsService.error(error);
      });
  }

  watchManifestEvents() {
    this.subscription = this.registryContractService.events()
      .subscribe((manifestation) => {
        console.log('Manifest Event: ' + manifestation.title);
        this.alertsService.success('Manifest Event: ' + manifestation.title);
      }, error => {
        this.alertsService.error(error);
      });
  }

  unwatchManifestEvents() {
    this.subscription.unsubscribe();
  }
}
