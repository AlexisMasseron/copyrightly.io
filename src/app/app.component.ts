import { Component, OnDestroy, OnInit } from '@angular/core';
import { ManifestEvent } from './manifestations/manifest-event';
import { filter, flatMap, takeUntil } from 'rxjs/operators';
import { ManifestationsContractService } from './manifestations/manifestations-contract.service';
import { AlertsService } from './alerts/alerts.service';
import { Web3Service } from './util/web3.service';
import { Subject } from 'rxjs/internal/Subject';
import { AuthenticationService } from './navbar/authentication.service';
import { ManifestEventComponent } from './manifestations/manifest-event.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private web3Service: Web3Service,
              private manifestationsContractService: ManifestationsContractService,
              private authenticationService: AuthenticationService,
              private alertsService: AlertsService) {}

  ngOnInit(): void {
    // this.watchManifestEvents();
    // TODO: Disabled because not working with current MetaMask and Web3 1.0, using events in tx receipt instead
  }

  watchManifestEvents() {
    this.authenticationService.getSelectedAccount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(filter(account => account !== ''))
      .pipe(flatMap((account: string) => this.manifestationsContractService.watchManifestEvents(account)))
      .subscribe( (event: ManifestEvent) => {
        console.log(event);
        this.alertsService.modal(ManifestEventComponent, event);
      }, error => {
        this.alertsService.error(error);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
