import { Component, OnDestroy, OnInit } from '@angular/core';
import { ManifestationEvent } from './registry/manifestation-event';
import { filter, flatMap, takeUntil } from 'rxjs/operators';
import { RegistryContractService } from './registry/registry-contract.service';
import { AlertsService } from './alerts/alerts.service';
import { Web3Service } from './util/web3.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Subject } from 'rxjs/internal/Subject';
import { AuthenticationService } from './navbar/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private web3Service: Web3Service,
              private registryContractService: RegistryContractService,
              private authenticationService: AuthenticationService,
              private alertsService: AlertsService) {}

  ngOnInit(): void {
    this.watchManifestEvents();
  }

  watchManifestEvents() {
    this.authenticationService.getSelectedAccount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(filter(account => account != ''))
      .pipe(flatMap((account: string) => this.registryContractService.watchManifestEvents(account)))
      .subscribe( (event: ManifestationEvent) => {
        console.log(event);
        this.alertsService.success(event.toHTML());
      }, error => {
        this.alertsService.error(error);
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
