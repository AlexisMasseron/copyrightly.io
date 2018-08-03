import { Component, OnDestroy, OnInit } from '@angular/core';
import { ManifestationEvent } from './registry/manifestation-event';
import { skip } from 'rxjs/operators';
import { RegistryContractService } from './registry/registry-contract.service';
import { AlertsService } from './alerts/alerts.service';
import { Web3Service } from './util/web3.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(private web3Service: Web3Service,
              private registryContractService: RegistryContractService,
              private alertsService: AlertsService) {}

  ngOnInit(): void {
    this.watchManifestEvents({});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  watchManifestEvents(filters) {
    this.subscription = this.registryContractService.watchEvents(filters)
    .pipe(skip(1)) // TODO: omitting one as it is the past last retrieved on load, confirm
    .subscribe( (event: ManifestationEvent) => {
      console.log(event);
      this.alertsService.success(event.toHTML());
    }, error => {
      this.alertsService.error(error);
    });
  }
}
